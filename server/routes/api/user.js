var express = require('express');
var router = express.Router();


function login(req, res, next) {
  agent.businessMan.signinUser(req.body.email, req.body.pw, function(_err, _sessionKey, _crypted_uid) {
    if (_err) {
      res.status(_err.code);
      res.json({
        error: _err
      });
    } else {
      res.status(200).json({
        error: null,
        sessionKey: _sessionKey,
        hashed_uid: _crypted_uid,
        email: req.body.email
      });
    }
  });
}

function logout(req, res) {

  agent.businessMan.signoutUser(req.query.sid, function(_err) {
    if (_err) {
      res.status(_err.code);
      res.json({
        error: _err
      });
    } else {
      if (req.method === 'POST') {
        res.status(200).json({
          error: null
        });
      } else if (req.method === 'GET') {
        res.redirect('/');
      }
    }
  });
}

function register(req, res, next) {

  agent.businessMan.registerUser(req, req.body, function(_err, _userId) {
    if (_err) {
      res.status(_err.code);
      res.json({
        error: _err
      });
    } else {
      res.status(200).json({
        error: null,
        userId: _userId
      });
    }
  });
}

function profile(req, res, next) {

  // profile 반환
  agent.businessMan.getSessionUserByQuery(req, (_err, _userData) => {
    if (_err) {
      res.status(_err.code).send({
        error: _err
      });
    } else {
      res.status(200).send(_userData);
    }
  })
}

function emailAuthorize(req, res, next) {
  let key = req.query.key;
  let email = req.query.email;

  agent.businessMan.emailCertifyUser(key, email, (_err, _result) => {
    if (_err !== null) {
      res.status(_err.code).send({
        error: _err
      });
    } else {
      res.redirect(`/admin/signin?email=${email}`);
    }
  });
}


/* GET home page. */
router.post('/register', register);

router.get('/email-authorize', emailAuthorize);

/* GET home page. */
router.get('/signin', login);
router.post('/signin', login);

router.get('/signout', logout);

router.get('/profile', profile);

export default router;