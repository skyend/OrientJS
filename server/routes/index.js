var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Service Builder'
  });
});

router.get('/admin/dashboard', function(req, res, next) {
  res.render('admin/index', {
    title: 'Service Builder'
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