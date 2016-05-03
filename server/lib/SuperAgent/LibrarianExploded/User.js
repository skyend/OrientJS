import Async from 'async';
import _ from 'underscore';
import uuid from 'uuid';
import bcrypt from 'bcrypt-nodejs';


export default {
  filterUserDocForPublic: function(_userDoc) {
    return _.omit(_userDoc.toJSON(), 'password', '__v');
  },

  getSessionUserDocByCookie: function(_req, _callback) {
    let sid = _req.cookies['ion-sb.sid'];
    let crypted_uid = _req.cookies['ion-sb.uid'];

    this.getUserBySession(sid, crypted_uid, (_err, _userDoc, _socketSession) => {
      if (_err) {

        _callback(_err, null);
      } else {

        _callback(null, _userDoc, _socketSession);
      }
    });
  },


  getSessionUserByQuery: function(_req, _callback) {
    let sid = _req.query['ion-sb.sid'];
    let crypted_uid = _req.query['ion-sb.uid'];

    this.getUserBySession(sid, crypted_uid, (_err, _userData, _socketSession) => {
      if (_err) {
        _callback(_err, null);
      } else {
        _callback(null, this.filterUserDocForPublic(_userData), _socketSession);
      }
    });
  },

  getSessionUserByCookie: function(_req, _callback) {

    this.getSessionUserDocByCookie(_req, (_err, _userDoc, _socketSession) => {
      if (_err) {
        _callback(_err, null);
      } else {
        _callback(null, this.filterUserDocForPublic(_userDoc), _socketSession);
      }
    });
  },

  getUserBySession: function(_sessionKey, _crypted_uid, _callback) {
    Async.waterfall([
      (_cb) => {
        this.agent.memStore.driver.readSession(_sessionKey, (_err, _sessionData) => {
          if (_err) {
            _cb(ERRORS("SESSION.READ_ERROR"), null);
          } else {
            if (_sessionData) {
              _cb(null, _sessionData);
            } else {
              _cb(ERRORS("SESSION.NOT_FOUND"));
            }
          }
        });
      }, (_sessionData, _cb) => {

        let id = _sessionData.id;
        let email = _sessionData.email;

        this.agent.dataStore.driver.getUserById(id, (_err, _userData) => {
          if (_err) {
            _cb(ERRORS("SESSION.COULD_NOT_FIND_RELATED_USER"));
          } else if (_userData === null) {

            _cb(ERRORS("SESSION.NOT_FOUND_RELATED_USER"), null);
          } else {

            try {
              if (bcrypt.compareSync(_userData.id, _crypted_uid)) {
                _cb(null, _userData);
              } else {
                _cb(ERRORS("SESSION.INVALID_SESSION"), null);
              }
            } catch (_e) {
              _cb(ERRORS("SESSION.INVALID_SESSION"), null);
            }
          }
        });
      },
      (_userData, _cb) => {
        if (_userData.deleted !== true && _userData.active) {
          if (_userData.certified) {
            _cb(null, _userData);
          } else {
            _cb(ERRORS("SESSION.INVALID_SESSION_OF_USER"), null);
          }
        } else {
          _cb(ERRORS("SIGNIN.INVALID_SESSION_OF_USER"), null);
        }
      }
    ], (_err, _userData) => {
      let socketSession = this.agent.socketStore.getSession(_sessionKey);

      if (_err) _callback(_err, null);
      else _callback(null, _userData, socketSession || null);
    });
  },

  assignSession: function(_userData, _callback) {
    this.agent.memStore.driver.createSession(_userData, (_err, _sessionKey) => {
      if (_err !== null) return _callback(ERRORS("SIGNIN.FAILED_CREATE_SESSION"), null);
      _callback(null, _sessionKey);
    });
  },

  signoutUser: function(_sessionKey, _callback) {
    this.agent.memStore.driver.removeSession(_sessionKey, (_err) => {
      if (_err !== null) return _callback(ERRORS("SESSION.FAIL_DELETE_SESSION"), null);
      _callback(null);
    });
  },

  signinUser: function(_emailId, _pw, _callback) {
    if (!_emailId) return _callback(ERRORS("SIGNIN.EMAIL_FIELD_IS_REQUIRED"));
    if (!_pw) return _callback(ERRORS("SIGNIN.PW_FIELD_IS_REQUIRED"));

    Async.waterfall([
      (_cb) => {
        this.agent.dataStore.driver.getUserByEmail(_emailId, (_err, _userData) => {

          if (_err !== null) {
            _cb(ERRORS("SIGNIN.NORMAL"), null);
          } else if (_userData === null) {
            _cb(ERRORS("SIGNIN.USER_NOT_FOUND"), null);
          } else {
            _cb(null, _userData);
          }
        });
      },
      (_userData, _cb) => {
        // 유저 삭제/활성 인증 확인

        if (_userData.deleted !== true && _userData.active) {
          if (_userData.certified) {
            _cb(null, _userData);
          } else {
            _cb(ERRORS("SIGNIN.DO_CERTIFY_EMAIL"), null);
          }
        } else {
          _cb(ERRORS("SIGNIN.USER_IS_NOT_AVAILABLE_USER"), null);
        }
      },
      (_userData, _cb) => {
        let compared;
        try {
          compared = bcrypt.compareSync(_pw, _userData.password);
        } catch (_e) {
          // 비밀번호 비교 실패
          // 데이터 베이스에 저장된 password 해시가 변조되었음을 뜻한다.
          this.agent.log.crit("User password temporary modified. User id:%s email:%s", _userData.id, _userData.email);

          _cb(ERRORS("SIGNIN.NORMAL"));
          return;
        }

        if (compared) {

          this.assignSession(_.pick(_userData, 'email', 'id'), (_err, _sessionKey) => {
            // session 생성
            if (_err !== null) {
              _cb(_err, null);
            } else {
              _cb(null, _userData, _sessionKey);
            }
          });
        } else {
          _cb(ERRORS("SIGNIN.PASSWORD_IS_NOT_MATCHED"), null);
        }
      }
    ], (_err, _userData, _sessionKey) => {
      if (_err) {
        _callback(_err, null);
      } else {
        _callback(null, _sessionKey, bcrypt.hashSync(_userData.id));
      }
    });
  },

  registerUser: function(_req, _data, _callback) {

    if (!_data.fullname) return _callback(ERRORS("SIGNUP.FULLNAME_FIELD_IS_REQUIRED"));
    if (!_data.email) return _callback(ERRORS("SIGNUP.EMAIL_FIELD_IS_REQUIRED"));
    if (!_data.pw) return _callback(ERRORS("SIGNUP.PW_FIELD_IS_REQUIRED"));
    if (!_data.confirm) return _callback(ERRORS("SIGNUP.CONFIRM_FIELD_IS_REQUIRED"));
    if (_data.pw !== _data.confirm) return _callback(ERRORS("SIGNUP.PASSWORD_IS_NOT_MATCHED"));

    Async.waterfall([
        (_cb) => {
          // config 에 allowSignup이 true 가 아니면 관리자만 사용자를 등록 할 수 있도록 처리.
          // 관리자의 유저 생성 체크
          if (this.agent.config.allowSignup) {
            _cb(null);
          } else {
            if (_req.cookies) {
              let sid = _req.cookies['ion-sb.sid'];
              let crypted_uid = _req.cookies['ion-sb.uid'];

              this.getUserBySession(sid, crypted_uid, (_err, _userData) => {
                if (_err) {
                  //_cb(_err);

                  // 이유를 캡슐화
                  _cb(ERRORS("SIGNUP.SYSTEM_IS_NOT_ALLOW_FREE_SIGNUP"));
                } else {
                  if (_userData !== null) {
                    if (_userData.superuser) {
                      _cb(null);
                    } else {
                      _cb(ERRORS("SIGNUP.SYSTEM_IS_NOT_ALLOW_FREE_SIGNUP"));
                    }
                  } else {
                    _cb(ERRORS("NORMAL"));
                  }
                }
              });
            }
          }
        },
        (_cb) => {
          // email 중복체크

          this.agent.dataStore.driver.getUserByEmail(_data.email, function(_err, _userData) {
            if (_err !== null) {
              _cb(ERRORS("SIGNUP.NORMAL"), null);
            } else if (_userData !== null) {
              _cb(ERRORS("SIGNUP.ALREADY_USED_EMAIL"), null);
            } else {
              _cb(null);
            }
          });
        },
        (_cb) => {
          // 현재 유저 수 카운트
          this.agent.dataStore.driver.getUserCount(function(_err, _count) {
            if (_err !== null) {
              _cb(ERRORS("SIGNUP.NORMAL"), null);
            } else {
              _cb(null, _count);
            }
          });
        },
        (_count, _cb) => {
          // 유저 등록
          let superuser = false;
          if (this.agent.config.firstMemberISSuper) {
            if (_count == 0) {
              superuser = true;
            }
          }

          this.agent.dataStore.driver.createUser({
            fullname: _data.fullname,
            email: _data.email,
            password: bcrypt.hashSync(_data.pw),
            superuser: superuser,
            role: "",
            active: true,
            deleted: false,
            certified: false, // certified를 false 로 초기값을 입력하고 후에 email인증을 통해 계정을 인증하도록 한다.
          }, function(_err, _result) {
            if (_err !== null) {

              _cb(ERRORS("SIGNUP.NORMAL"), null);
            } else {

              _cb(null, _result);
            }
          });
        },
        (_userData, _cb) => {
          // 인증서 데이터베이스에 발급
          this.agent.dataStore.driver.createUserEmailCertification(_userData.id, (_err, _result) => {
            if (_err !== null) {
              _cb(ERRORS("SIGNUP.FAIL_CREATE_CERTIFICATION"), null, null);
            } else {
              _cb(null, _result.key, _userData);
            }
          });
        },
        (_certificationKey, _userData, _cb) => {

          // 인증메일 전송
          let key = '';
          let linkPath = `${this.agent.config.external_url}/api/user/email-authorize?key=${_certificationKey}&email=${_userData.email}`;

          // Email 전송
          let body = '계정을 사용하시기 위해서 아래의 링크를 클릭하여 이메일 확인을 진행 하여 주세요.';
          body += `<br/><a href="${linkPath}"> click </a>`;

          this.agent.mail.sendMail(_userData.email, 'welcome I-ON Service Builder', body, (_err, _res) => {
            if (_err !== null) {
              _cb(ERRORS("SIGNUP.FAIL_SENT_MAIL"));
            } else {
              _cb(null, _userData);
            }
          });
        }
      ],
      (_err, _userData) => {
        if (_err) {
          _callback(_err, null);
        } else {
          _callback(null, _userData);
        }
      });
  },

  emailCertifyUser: function(_key, _email, _callback) {
    Async.waterfall([
      (_cb) => {
        this.agent.dataStore.driver.getEmailCertification(_key, (_err, _cert) => {
          if (_err !== null) {
            _cb(ERRORS("SIGNUP.FAIL_CERTIFY_USER"));
          } else {
            if (_cert === null) {
              _cb(ERRORS("SIGNUP.NOT_FOUND_CERTIFICATION"));
            } else {
              _cb(null, _cert);
            }
          }
        });
      }, (_cert, _cb) => {
        let userid = _cert.user_id;

        this.agent.dataStore.driver.getUserById(userid, (_err, _userData) => {
          if (_err !== null) {

            _cb(ERRORS("SIGNUP.COULD_NOT_FIND_CERTIFICATION_USER"));
          } else {
            if (_userData !== null) {
              if (_userData.email === _email) {
                // 인증성공
                _cb(null, _userData);
              } else {
                _cb(ERRORS("SIGNUP.USER_NOT_MATCHED_CERTIFICATION"));
              }
            } else {
              _cb(ERRORS("SIGNUP.NOT_FOUND_CERTIFICATION_USER"));
            }
          }
        });
      },
      (_userData, _cb) => {
        // 인증통과후 인증서 제거 및 user 인증여부 업데이트
        this.agent.dataStore.driver.updateUserById(_userData.id, {
          certified: true
        }, (_err, _userData) => {
          if (_err !== null) {
            _cb(ERRORS("DB_ERROR"), null);
          } else {
            _cb(null, _userData);
          }
        });
      },
      (_userData, _cb) => {
        this.agent.dataStore.driver.deleteEmailCertification(_key, (_err) => {
          if (_err !== null) {
            _cb(ERRORS("SIGNUP.FAIL_REMOVE_CERTIFICATION"), null);
          } else {
            _cb(null, _userData);
          }
        })
      }
    ], (_err, _result) => {
      if (_err !== null) {
        _callback(_err, null);
      } else {
        _callback(null, _result);
      }
    });
  }
}