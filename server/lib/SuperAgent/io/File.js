import fse from 'fs-extra';
import fs from 'fs';
import path from 'path';

class File {
  constructor(_agent) {
    this.agent = _agent;

    this.templateDirPath = path.join(this.agent.rootDirname, '/temp/uploaded-templates/');
  }

  writeProjectTemplateZip(_file, _name, _callback) {
    let fstream;

    fs.stat(this.templateDirPath, (_err, _stats) => {
      if (_err !== null) {
        if (_err.code === 'ENOENT') {
          // 디렉터리가 없을 때 새로 만듬

          fse.mkdirs(this.templateDirPath, (err) => {
            if (err) return console.error(err);

            this.writeProjectTemplate(_file, _name, _callback);
          });
        } else {
          this.agent.log.fatal(`Fail template upload. check temp template upload directory. Code:${_err.code}`);
          _callback(_err);
        }
      } else {
        if (_stats.isDirectory()) {
          // 업로드 파일 data 디렉토리에 저장
          fstream = fse.createWriteStream(path.join(this.templateDirPath, _name));

          _file.on('data', function(_data) {
            fstream.write(_data);
          });

          _file.on('end', function() {
            _callback(null);
          });
        } else {
          this.agent.log.fatal(`Fail template upload. Temp template upload directory is not Directory.`);
          _callback(ERRORS("UPLOAD_TEMPLATE.TEMPLATE_UPLOAD_PATH_IS_NOT_DIRECTORY"));
        }
      }
    });
  }
}

export default File;