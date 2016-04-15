function createError(_code, _message) {
  let e = new Error(_message);
  e.code = _code;
  return e;
}





export default {
  "FAIL_REGISTER_USER": new Error("fail register user"),


  "SIGNUP": {
    "FULLNAME_FIELD_IS_REQUIRED": createError("SIGNUP.FULLNAME_FIELD_IS_REQUIRED", "Fullname field is required"),
    "EMAIL_FIELD_IS_REQUIRED": createError("SIGNUP.EMAIL_FIELD_IS_REQUIRED", "EMAIL field is required"),
    "PW_FIELD_IS_REQUIRED": createError("SIGNUP.PW_FIELD_IS_REQUIRED", "PW field is required"),
    "PW_CONFIRM_FIELD_IS_REQUIRED": createError("SIGNUP.PW_CONFIRM_FIELD_IS_REQUIRED", "PW_CONFIRM field is required"),
    "PASSWORD_IS_NOT_MATCHED": createError("SIGNUP.PASSWORD_IS_NOT_MATCHED", "Confirm password is not matched"),
    "NORMAL": createError("SIGNUP.NORMAL", "Error."),
    "ALREADY_USED_EMAIL": createError("SIGNUP.ALREADY_USED_EMAIL", 'Already used email.'),
    "SYSTEM_IS_NOT_ALLOW_FREE_SIGNUP": createError("SIGNUP.SYSTEM_IS_NOT_ALLOW_FREE_SIGNUP", "System is not allow free signup."),
  },

  "SIGNIN": {
    "EMAIL_FIELD_IS_REQUIRED": createError("SIGNIN.EMAIL_FIELD_IS_REQUIRED", "EMAIL field is required"),
    "PW_FIELD_IS_REQUIRED": createError("SIGNIN.PW_FIELD_IS_REQUIRED", "PW field is required"),
    "NORMAL": createError("SIGNIN.NORMAL", "Error."),
    "FAILED_CREATE_SESSION": createError("SIGNIN.FAILED_CREATE_SESSION", "fail create session.")
  }
};