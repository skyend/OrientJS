import User from './Librarian/User.js';
import Async from 'async';
import filter from 'object-key-filter';
import _ from 'underscore';
import uuid from 'uuid';

import bcrypt from 'bcrypt-nodejs';



class Librarian {
  constructor(_agent) {
    this.agent = _agent;
  }

  assignSession(_userData, _callback) {
    let sessionKey = bcrypt.hashSync(uuid.v1() + uuid.v4());

    this.agent.memStore.driver.createSession(sessionKey, _userData, (_err, _result) => {
      if (_err !== null) return _callback(ERRORS.SIGNIN.FAILED_CREATE_SESSION, null);

      _callback(null, sessionKey);
    });
  }

  signinUser(_emailId, _pw, _callback) {
    if (!_emailId) return _callback(ERRORS.SIGNIN.EMAIL_FIELD_IS_REQUIRED);
    if (!_pw) return _callback(ERRORS.SIGNIN.PW_FIELD_IS_REQUIRED);

    Async.waterfall([
      (_cb) => {
        this.agent.dataStore.driver.getUserByEmail(_emailId, (_err, _userData) => {

          if (_err !== null) {
            _cb(ERRORS.SIGNIN.NORMAL, null);
          } else if (_userData !== null) {
            _cb(null, _userData);
          }
        });
      },
      (_userData, _cb) => {
        if (bcrypt.compareSync(_pw, _userData.password)) {

          this.assignSession(_.pick(_userData, 'email', 'id'), (_err, _sessionKey) => {
            // session 생성
            if (_err !== null) {
              _cb(_err);
            } else {
              _cb(null, _sessionKey);
            }
          });
        } else {
          _cb(ERRORS.SIGNIN.PASSWORD_IS_NOT_MATCHED);
        }
      }
    ], (_err, _sessionKey) => {
      if (_err) {
        _callback(_err, null);
      } else {
        _callback(null, _sessionKey);
      }
    });
  }

  registerUser(_req, _data, _callback) {
    // config 에 allowSignup이 true 가 아니면 관리자만 사용자를 등록 할 수 있도록 처리 해야 함.
    if (!this.agent.config.allowSignup) return _callback(ERRORS.SIGNUP.SYSTEM_IS_NOT_ALLOW_FREE_SIGNUP);

    if (!_data.fullname) return _callback(ERRORS.SIGNUP.FULLNAME_FIELD_IS_REQUIRED);
    if (!_data.email) return _callback(ERRORS.SIGNUP.EMAIL_FIELD_IS_REQUIRED);
    if (!_data.pw) return _callback(ERRORS.SIGNUP.PW_FIELD_IS_REQUIRED);
    if (!_data.confirm) return _callback(ERRORS.SIGNUP.CONFIRM_FIELD_IS_REQUIRED);
    if (_data.pw !== _data.confirm) return _callback(ERRORS.SIGNUP.PASSWORD_IS_NOT_MATCHED);

    Async.waterfall([
        (_cb) => {
          // email 중복체크

          this.agent.dataStore.driver.getUserByEmail(_data.email, function(_err, _userData) {
            if (_err !== null) {
              _cb(ERRORS.SIGNUP.NORMAL, null);
            } else if (_userData !== null) {
              _cb(ERRORS.SIGNUP.ALREADY_USED_EMAIL, null);
            } else {
              _cb(null);
            }
          });
        },
        (_cb) => {
          // 현재 유저 수 카운트

          this.agent.dataStore.driver.getUserCount(function(_err, _count) {
            if (_err !== null) {
              _cb(ERRORS.SIGNUP.NORMAL, null);
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
            role: ""
          }, function(_err, _result) {
            if (_err !== null) {

              _cb(ERRORS.SIGNUP.NORMAL, null);
            } else {

              _cb(null, _result);
            }
          });
        }
      ],
      function done(_err, _userId) {
        _callback(_err, _userId);
      }
    )
  }
}

export default Librarian;