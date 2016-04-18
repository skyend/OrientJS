var express = require('express');
var router = express.Router();


function login(req, res, next) {
  agent.businessMan.signinUser(req.body.email, req.body.pw, function(_err, _sessionKey) {

    res.json({
      error: _err,
      sessionKey: _sessionKey,
      email: req.body.email
    });
  });
}

function register(req, res, next) {

  agent.businessMan.registerUser(req, req.body, function(_err, _userId) {

    res.json({
      error: _err,
      userId: _userId
    });
  });
}

function profile(req, res, next) {
  // profile 반환
}

function emailAuthorize(req, res, next) {
  let key = req.query.key;
  let email = req.query.email;

  agent.businessMan.emailCertifyUser(key, email, (_err, _result) => {
    if (_err !== null) {
      res.send(_err);
    } else {
      res.redirect(`/admin/signin?email=${email}`);
    }
  });
}


/* GET home page. */
router.post('/register', register);
router.get('/register', register);

router.get('/email-authorize', emailAuthorize);

/* GET home page. */
router.post('/signin', login);
router.get('/signin', login);

router.post('/profile', profile);
router.get('/profile', profile);

export default router;