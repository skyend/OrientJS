import Worker from './Worker';
import AdmZip from 'adm-zip';
import async from 'async';

/**
 * TemplateParser
 *
 * Work Parameters
 *  project_id : String
 *  stored_template_file_name : String
 *  socketSession : SocketSession
 *  user: UserData
 *  callback: Function
 */
class ProjectTemplateParser extends Worker {
  constructor(_agent, _userDoc, _socketSession, _workDoc, _workParams) {
    super(_agent, _userDoc, _socketSession, _workDoc, _workParams);


    this.project_id = _workParams.project_id;
    this.template_file_name = _workParams.stored_template_file_name;
  }

  start() {
    this.parseZip();
  }

  parseZip() {
    var absolutePath = this.agent.fileStore.getAbsolutePathOfProjectTemplate(this.template_file_name);
    this.templateZip = new AdmZip(absolutePath);
    var zipEntries = this.templateZip.getEntries();

    async.eachSeries(zipEntries, (zipEntry, _cb) => {
      console.log(zipEntry, `extra:${ zipEntry.extra}, name:${zipEntry.name}, entryName:${zipEntry.entryName}`); // outputs zip entries information

      if (zipEntry.isDirectory) {
        // directory

      } else {
        // file

      }
      // this.agent.socketStore.tryEmit(this.socketSession, 'create-project', {
      //   line: zipEntry.entryName
      // });
    });
  }


}

export default ProjectTemplateParser;