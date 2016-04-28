var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  agent.businessMan.getSessionUserByCookie(req, (_err, _userData) => {
    if (_userData) {
      res.redirect('/admin/dashboard');
    } else {
      res.render('index', {
        title: 'Service Builder'
      });
    }
  });
});


router.get('/health', function(req, res) {

  res.render('monitor/health', {
    //pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });

  // res.send(new Buffer(JSON.stringify({
  //   pid: process.pid,
  //   memory: process.memoryUsage(),
  //   uptime: process.uptime()
  // })));
});

module.exports = router;