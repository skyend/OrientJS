var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/register', function(req, res, next) {
  agent.businessMan.registerUser(req.body, function(_err, _userId) {
    console.log(_err, _userId);
    res.json({
      error: _err,
      userId: _userId
    });
  });
});

export default router;