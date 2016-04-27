function createError(_code, _key, _message) {
  let e = new Error(_message);
  e.key = _key;
  e.code = _code;
  e.reason = _message;
  return e;
}





export default {
  "FAIL_REGISTER_USER": new Error("fail register user"),
  "DB_ERROR": createError(400, "DB_ERROR", "DB Error"),
  "NORMAL": createError(400, "NORMAL", "normal"),

  "SIGNUP": {
    "FULLNAME_FIELD_IS_REQUIRED": createError(400, "SIGNUP.FULLNAME_FIELD_IS_REQUIRED", "Fullname field is required"),
    "EMAIL_FIELD_IS_REQUIRED": createError(400, "SIGNUP.EMAIL_FIELD_IS_REQUIRED", "EMAIL field is required"),
    "PW_FIELD_IS_REQUIRED": createError(400, "SIGNUP.PW_FIELD_IS_REQUIRED", "PW field is required"),
    "PW_CONFIRM_FIELD_IS_REQUIRED": createError(400, "SIGNUP.PW_CONFIRM_FIELD_IS_REQUIRED", "PW_CONFIRM field is required"),
    "PASSWORD_IS_NOT_MATCHED": createError(400, "SIGNUP.PASSWORD_IS_NOT_MATCHED", "Confirm password is not matched"),
    "NORMAL": createError(400, "SIGNUP.NORMAL", "Error."),
    "ALREADY_USED_EMAIL": createError(400, "SIGNUP.ALREADY_USED_EMAIL", 'Already used email.'),
    "SYSTEM_IS_NOT_ALLOW_FREE_SIGNUP": createError(400, "SIGNUP.SYSTEM_IS_NOT_ALLOW_FREE_SIGNUP", "System is not allow free signup."),
    "FAIL_SENT_MAIL": createError(400, "SIGNUP.FAIL_SENT_MAIL", "failed sent account certification mail"),
    "FAIL_CREATE_CERTIFICATION": createError(400, "SIGNUP.FAIL_CREATE_CERTIFICATION", 'failed create certification'),
    "FAIL_CERTIFY_USER": createError(400, 'SIGNUP.FAIL_CERTIFY_USER', 'fail certify user'),
    "NOT_FOUND_CERTIFICATION": createError(400, 'SIGNUP.NOT_FOUND_CERTIFICATION', "Not found certification"),
    "NOT_FOUND_CERTIFICATION_USER": createError(400, 'SIGNUP.NOT_FOUND_CERTIFICATION_USER', "Not found certification user"),
    "USER_NOT_MATCHED_CERTIFICATION": createError(400, "SIGNUP.USER_NOT_MATCHED_CERTIFICATION", ""),
    "COULD_NOT_FIND_CERTIFICATION_USER": createError(400, "SIGNUP.COULD_NOT_FIND_CERTIFICATION_USER", "")
  },

  "SIGNIN": {
    "EMAIL_FIELD_IS_REQUIRED": createError(400, "SIGNIN.EMAIL_FIELD_IS_REQUIRED", "EMAIL field is required"),
    "PW_FIELD_IS_REQUIRED": createError(400, "SIGNIN.PW_FIELD_IS_REQUIRED", "PW field is required"),
    "NORMAL": createError(400, "SIGNIN.NORMAL", "Error."),
    "PASSWORD_IS_NOT_MATCHED": createError(400, "SIGNIN.PASSWORD_IS_NOT_MATCHED", "password is not matched"),
    "FAILED_CREATE_SESSION": createError(400, "SIGNIN.FAILED_CREATE_SESSION", "fail create session."),
    "DO_CERTIFY_EMAIL": createError(400, "SIGNIN.DO_CERTIFY_EMAIL", "do certify email"), // 인증 메일 전송 요청 필요
    "USER_IS_NOT_AVAILABLE_USER": createError(400, "SIGNIN.USER_IS_NOT_AVAILABLE_USER", "user is not available"),
    "USER_NOT_FOUND": createError(400, "SIGNIN.USER_NOT_FOUND", "User not found")
  },


  "SESSION": {
    "FAIL_DELETE_SESSION": createError(500, "SESSION.FAIL_DELETE_SESSION", "Fail delete session"),
    "READ_ERROR": createError(400, "SESSION.READ_ERROR", "Fail read session read."),
    "NOT_FOUND": createError(400, "SESSION.NOT_FOUND", "Session not found"), // 세션을 찾을 수 없음
    "NOT_FOUND_RELATED_USER": createError(400, "SESSION.NOT_FOUND_RELATED_USER", "Not found related user"), // 데이터베이스에 세션에 해당하는 유저가 존재하지 않음
    "COULD_NOT_FIND_RELATED_USER": createError(400, "SESSION.COULD_NOT_FIND_RELATED_USER", "Couldn't find user."), // DataBase find Error
    "INVALID_SESSION_OF_USER": createError(400, "SESSION.INVALID_SESSION_OF_USER", "Invalid session of user"),
    "INVALID_SESSION": createError(400, "SESSION.INVALID_SESSION", "Invalid session")
  }
};