class UserManager {
  constructor(_app) {
    this.app = _app;
  }

  signin(_id, _password, _complete) {
    var self = this;
    this.app.gelateriaRequest.signinUser(_id, _password, function(_result) {
      self.app.gotCeritification(_result.authorityToken, _result.date);
      _complete(_result);
    });
  }

  signout() {
    self.app.removeCeritification();
  }

  register(_userspec, _complete) {
    this.app.gelateriaRequest.registerUser(_userspec, function(_result) {
      _complete(_result);
    });
  }

  getCurrent(_complete) {
    this.app.gelateriaRequest.loadUserData(function(_result) {
      _complete(_result);
    });
  }
}

module.exports =  UserManager;