import User from './Librarian/User.js';
import Async from 'async';

class Librarian {
  constructor(_agent) {
    this.agent = _agent;
  }

  registerUser(_data, _callback) {
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
            password: _data.pw,
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