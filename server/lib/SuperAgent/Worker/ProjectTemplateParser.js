import Worker from './Worker';
import AdmZip from 'adm-zip';
import async from 'async';
import path from 'path';

/**
 * ProjectTemplateParser
 *
 * Work Parameters
 *  project_id : String
 *  stored_template_file_name : String
 */
class ProjectTemplateParser extends Worker {
  constructor(_agent, _userDoc, _socketSession, _workDoc, _workParams, _finishCallback, _errorCallback) {
    super(_agent, _userDoc, _socketSession, _workDoc, _workParams, _finishCallback, _errorCallback);

    this.project_id = _workParams.project_id;
    this.template_file_name = _workParams.stored_template_file_name;

    // cache tree
    this.vfnodeTree = {};
  }

  start(_callback) {
    super.start(_callback);

    this.agent.dataStore.driver.getProjectRootVFNodeDoc(this.project_id, (_err, _vfnodeDoc) => {
      if (_err) {

      } else {
        this.parseZip(_vfnodeDoc);
      }
    });

    //this.parseZip();
  }

  parseZip(_rootVFNodeDoc, _callback) {
    var absolutePath = this.agent.fileStore.getAbsolutePathOfProjectTemplate(this.template_file_name);
    this.templateZip = new AdmZip(absolutePath);
    var zipEntries = this.templateZip.getEntries();

    console.log('parseZip', _rootVFNodeDoc);

    async.eachSeries(zipEntries, (zipEntry, _next) => {
        //console.log(zipEntry, `extra:${ zipEntry.extra }, name:${zipEntry.name}, entryName:${zipEntry.entryName}`); // outputs zip entries information

        this.log(zipEntry.entryName, () => {});

        // project 의 root directory 는 이미 만들어 져 있으므로 패스에 'root/'를 추가한다.
        let rootSolvedPath = path.join('root/', zipEntry.entryName);

        // 디렉토리가 아니면 file 이므로 filename_seperator 두번째 인자로 zipEntry.isDirectory 의 역을 입력한다.
        let seperated = this.filename_seperator(rootSolvedPath, !zipEntry.isDirectory);


        this.dir_resolve(_rootVFNodeDoc, seperated.dirPathArray, (_err) => {
          if (zipEntry.isDirectory) {
            // directory

            _next(null);
          } else {
            // file
            // 파일 노드 생성 및 물리파일 저장

            _next(null);
          }
        });
      },
      (_err) => {
        if (_err) {

        } else {

        }
      });
  }


  /**
   * Dir resolve
   * 디렉토리 패스를 입력받아 프로젝트의 디렉토리 구조를 체크하고 없는 디렉토리는 생성한다.
   *
   * return
   *  VOID
   * callback
   *  Error
   */
  dir_resolve(_rootVFNodeDoc, _dirPathArray, _callback) {

    this.agent.businessMan.explorerProjectVFNodeDirStemWithSolve(this.project_id, _dirPathArray, (_err, _vfnodeDocSeries, _createdVFNodes) => {

    });


    // let upperDirname;
    // async.eachSeries(_dirPathArray, (_dirname, _next) => {
    //   if (upperDirname) {
    //
    //     console.log('Upper Dirname', upperDirname);
    //   } else {
    //
    //     // // upperDirname 이 세팅되어 있지 않으면 루트에 템플릿루트를 생성한다.
    //     // this.agent.businessMan.createEmptyDir(this.userDoc.id, _dirname, (_err, _vfnodeDoc) => {
    //     //   if (_err) {
    //     //     _next(_err);
    //     //   } else {
    //     //     _rootVFNodeDoc.refferences.push(_vfnodeDoc.id);
    //     //     _rootVFNodeDoc.save((_err) => {
    //     //
    //     //       upperDirname = _dirname;
    //     //
    //     //       if (_err) {
    //     //         _next(_err);
    //     //       } else {
    //     //         _next(null);
    //     //       }
    //     //     });
    //     //   }
    //     // });
    //   }
    // }, (_err) => {
    //
    // });
  }

  /**
   * Filename Seperator
   * 파일명에서 디렉토리 패스와 실제 파일 명을 분리한다.
   * return
   *  { filename: String, dirPath: String, dirPathArray: Array }
   */
  filename_seperator(_filename, _lastIsFile) {
    let seperated = _filename.split(path.sep);
    let filename_element;
    let dirPathSlice;

    if (_lastIsFile) {
      filename_element = seperated[seperated.length - 1];
      dirPathSlice = seperated.slice(0, seperated.length - 1);
    } else {
      filename_element = null;
      dirPathSlice = seperated.slice(0, seperated.length - 1);
    }

    return {
      filename: filename_element !== null ? filename_element : null,
      dirPath: dirPathSlice.join('/'),
      dirPathArray: dirPathSlice,
      origin: _filename
    };
  }
}

export default ProjectTemplateParser;