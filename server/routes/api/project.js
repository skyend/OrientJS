var express = require('express');
var router = express.Router();


function create(req, res) {
  let projectFormDatas = {};


  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    if (fieldname === 'project_real_id') projectId = val;
    else if (fieldname === 'name') name = val;
  });

  req.busboy.on('file', function(fieldname, file, filename) {
    console.log('File [' + fieldname + ']: value: ' + filename);
    // if (fieldname === 'publishZipFile') {
    //   publishZipFilename = filename;
    //
    //   var outputFilename = "+" + Date.now() + '_' + publishZipFilename;
    //   var outputFilePath = __dirname + '/../data/' + outputFilename;
    //   outputFilePath = outputFilePath.replace(/\s/g, '_');
    //
    //
    //   var fstream;
    //   // 업로드 파일 data 디렉토리에 저장
    //   fstream = fs.createWriteStream(outputFilePath);
    //
    //   file.on('data', function(_data) {
    //     fstream.write(_data);
    //   });
    //
    //   file.on('end', function() {
    //     console.log("file end");
    //     publishFilePath = outputFilePath;
    //   });
    // }
  });

  req.busboy.on('finish', function() {
    debug('Done parsing form!');
    console.log('name', name, 'pid', projectId);

    // // 서비스 생성
    // ServiceModel.create({
    //   name: name,
    //   project_id: projectId
    // }, function(_err, _service) {
    //   debug(_err, _service);
    //
    //   // debug("Saved", _err, _service);
    //   var serviceId = _service._id;
    //
    //   // 퍼블리시 파일 패스가 존재하면 ServiceParser로 파싱 시작
    //   if (publishFilePath !== undefined) {
    //
    //     // debug("Saved", _err, _service);
    //     var serviceId = _service._id;
    //
    //     var serviceParser = new ServiceParser(publishFilePath, serviceId, function(_resources) {
    //       // debug('ServiceParser finished', _resources);
    //       res.send(JSON.stringify({
    //         result: 'success',
    //         service: _service,
    //         errors: _resources.errors,
    //         headInfos: _resources.headInfos
    //       }));
    //
    //     });
    //
    //   } else {
    //     // 없다면 서비스만 생성한것으로 완료
    //     res.json({
    //       result: 'success',
    //       service: _service
    //     });
    //   }
    // });
  });


  req.pipe(req.busboy);

  // agent.businessMan.createProject(req, projectFormDatas, (_err, _result) => {
  //   if (_err !== null) {
  //     res.status(_err.code).send({
  //       error: _err
  //     });
  //   } else {
  //     res.redirect(`/admin/signin?email=${email}`);
  //   }
  // });
}

/* GET home page. */
router.post('/create', create);

export default router;