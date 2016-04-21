var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/signin', function(req, res, next) {

  res.render('admin/sign/login', {
    title: 'Service Builder'
  });
  return;

  // profile 반환
  agent.businessMan.getSessionUserByCookie(req, (_err, _userData) => {
    if (_userData) {
      res.redirect('/admin/dashboard');
    } else {
      res.render('admin/sign/login', {
        title: 'Service Builder'
      });
    }
  })


});

router.get('/signup', function(req, res, next) {
  res.render('admin/sign/register', {
    title: 'Service Builder'
  });

  // profile 반환
  // agent.businessMan.getSessionUserByCookie(req, (_err, _userData) => {
  //   if (_userData) {
  //     res.redirect('/admin/dashboard');
  //   } else {
  //     res.render('admin/sign/register', {
  //       title: 'Service Builder'
  //     });
  //   }
  // })
});

router.get('/dashboard', function(req, res, next) {
  console.log(req.cookies);
  // profile 반환
  agent.businessMan.getSessionUserByCookie(req, (_err, _userData) => {

    if (_err) {
      res.render('redirection_runway', {
        title: _err.key,
        message: _err.reason,
        status: _err.code,
        redirection: '/admin/signin'
      });
    } else {
      res.render('admin/dashboard/index', {
        title: 'Service Builder',
        user: _userData,
        page: {
          name: "Dashboard",
          path: ['dashboard']
        }
      });
    }
  })
});


export default router;