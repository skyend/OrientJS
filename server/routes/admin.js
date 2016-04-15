var express = require('express');
var router = express.Router();

/* GET home page. */
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

router.get('/dashboard', function(req, res, next) {
  res.render('admin/dashboard/index', {
    title: 'Service Builder'
  });
});


export default router;