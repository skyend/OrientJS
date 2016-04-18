function createError(_code, _message) {
  let e = new Error(_message);
  e.code = _code;
  return e;
}





export default {
  "FAIL_REGISTER_USER": new Error("fail register user"),
  "DB_ERROR": createError("DB_ERROR", "DB Error"),

  "SIGNUP": {
    "FULLNAME_FIELD_IS_REQUIRED": createError("SIGNUP.FULLNAME_FIELD_IS_REQUIRED", "Fullname field is required"),
    "EMAIL_FIELD_IS_REQUIRED": createError("SIGNUP.EMAIL_FIELD_IS_REQUIRED", "EMAIL field is required"),
    "PW_FIELD_IS_REQUIRED": createError("SIGNUP.PW_FIELD_IS_REQUIRED", "PW field is required"),
    "PW_CONFIRM_FIELD_IS_REQUIRED": createError("SIGNUP.PW_CONFIRM_FIELD_IS_REQUIRED", "PW_CONFIRM field is required"),
    "PASSWORD_IS_NOT_MATCHED": createError("SIGNUP.PASSWORD_IS_NOT_MATCHED", "Confirm password is not matched"),
    "NORMAL": createError("SIGNUP.NORMAL", "Error."),
    "ALREADY_USED_EMAIL": createError("SIGNUP.ALREADY_USED_EMAIL", 'Already used email.'),
    "SYSTEM_IS_NOT_ALLOW_FREE_SIGNUP": createError("SIGNUP.SYSTEM_IS_NOT_ALLOW_FREE_SIGNUP", "System is not allow free signup."),
    "FAIL_SENT_MAIL": createError("SIGNUP.FAIL_SENT_MAIL", "failed sent account certification mail"),
    "FAIL_CREATE_CERTIFICATION": createError("SIGNUP.FAIL_CREATE_CERTIFICATION", 'failed create certification'),
    "FAIL_CERTIFY_USER": createError('SIGNUP.FAIL_CERTIFY_USER', 'fail certify user'),
    "NOT_FOUND_CERTIFICATION": createError('SIGNUP.NOT_FOUND_CERTIFICATION', "Not found certification")
  },
  "SIGNIN": {
    "EMAIL_FIELD_IS_REQUIRED": createError("SIGNIN.EMAIL_FIELD_IS_REQUIRED", "EMAIL field is required"),
    "PW_FIELD_IS_REQUIRED": createError("SIGNIN.PW_FIELD_IS_REQUIRED", "PW field is required"),
    "NORMAL": createError("SIGNIN.NORMAL", "Error."),
    "PASSWORD_IS_NOT_MATCHED": createError("SIGNIN.PASSWORD_IS_NOT_MATCHED", "password is not matched"),
    "FAILED_CREATE_SESSION": createError("SIGNIN.FAILED_CREATE_SESSION", "fail create session."),
    "DO_CERTIFY_EMAIL": createError("SIGNIN.DO_CERTIFY_EMAIL", "do certify email"), // 인증 메일 전송 요청 필요
    "USER_IS_NOT_AVAILABLE_USER": createError("SIGNIN.USER_IS_NOT_AVAILABLE_USER", "user is not available"),
    "USER_NOT_FOUND": createError("SIGNIN.USER_NOT_FOUND", "User not found")
  },

  "SESSION": {
    "READ_ERROR": createError("SESSION.READ_ERROR", "Fail read session read."),
    "NOT_FOUND": createError("SESSION.NOT_FOUND", "Session not found"),
    "NOT_FOUND_RELATED_USER": createError("SESSION.NOT_FOUND_RELATED_USER", "Not found related user")
  }
};