var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/index', {
    title: 'Service Builder'
  });
});

router.get('/signin', function(req, res, next) {
  res.render('admin/sign/login', {
    title: 'Service Builder'
  });
});

router.get('/signup', function(req, res, next) {
  res.render('admin/sign/register', {
    title: 'Service Builder'
  });
});


export default router;