var express = require('express');
var router = express.Router();

import Common from './common';

router.get('*', Common.checkIsMember);

router.get('/create', function(req, res) {

  res.render('admin/dashboard/project/create', {
    user: req.user,
    page: {
      name: "Create Project",
      path: ['Dashboard', 'project', 'create']
    }
  });
});


export default router;