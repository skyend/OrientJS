module.exports = {
  checkIsMember: function(req, res, next) {

    agent.businessMan.getSessionUserByCookie(req, (_err, _userData) => {

      if (_err) {

        res.render('redirection_runway', {
          title: _err.key,
          message: _err.reason,
          status: _err.code,
          redirection: '/admin/signin'
        });
      } else {
        req.user = _userData;

        next();
      }
    });
  }
}