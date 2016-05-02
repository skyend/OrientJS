var express = require('express');
var router = express.Router();

import Common from './common';

router.get('*', Common.checkIsMember);

router.get('/', function(req, res) {

  res.render('admin/task/index', {
    user: req.user,
    page: {
      name: "Task List",
      path: ['Dashboard', 'tasks']
    }
  });
});


export default router;