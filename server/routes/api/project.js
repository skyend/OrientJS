var express = require('express');
var router = express.Router();
var inspect = require('util').inspect;
var debug = require('debug')('API:PROJECT');
import uuid from 'uuid';

function create(req, res) {

  agent.businessMan.getSessionUserDocByCookie(req, function(_err, _userDoc, _socketSession) {
    let projectFormDatas = {};

    if (_err) {
      return res.status(_err.code).send({
        error: _err
      });
    }

    req.busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val), val);

      projectFormDatas[fieldname] = val;
    });

    req.busboy.on('file', (fieldname, file, filename) => {
      console.log('File [' + fieldname + ']: value: ' + filename);

      if (fieldname === 'template-zip') {
        var outputFilename = uuid.v4() + '-' + Date.now() + '_' + filename.replace(/\s/g, '_');

        agent.fileStore.writeProjectTemplateZip(file, outputFilename, (_err) => {

          if (_err !== null) {
            let error = ERRORS("PROJECT.CREATE.FAIL_UPLOAD_TEMPLATE_ZIP");

            _res.status(error.code).send({
              error: error
            });
          } else {
            projectFormDatas.template_filename = outputFilename;
          }
        });
      }
    });

    req.busboy.on('finish', (_err) => {
      debug('Done parsing form!');
      if (_err) {
        let error = ERRORS("PROJECT.CREATE.ERROR");

        _res.status(error.code).send({
          error: error
        });
      } else {

        agent.businessMan.createProject(_userDoc, _socketSession, projectFormDatas, (_err, _project) => {
          if (_err !== null) {
            res.status(_err.code).send({
              error: _err
            });
          } else {
            res.send({
              error: null,
              project: _project
            });
          }
        });
      }
    });

    req.pipe(req.busboy);
  });
}

/* GET home page. */
router.post('/create', create);

export default router;