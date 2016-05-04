import User from './LibrarianExploded/User.js';
import Project from './LibrarianExploded/Project.js';
import VFNode from './LibrarianExploded/VFNode.js';

import Async from 'async';
import filter from 'object-key-filter';
import _ from 'underscore';
import uuid from 'uuid';
import bcrypt from 'bcrypt-nodejs';

// Workers
import Worker_ProjectTemplateParser from './Worker/ProjectTemplateParser';

/*
    ██████  ██    ██ ███████ ██ ███    ██ ███████ ███████ ███████ ███    ███  █████  ███    ██
    ██   ██ ██    ██ ██      ██ ████   ██ ██      ██      ██      ████  ████ ██   ██ ████   ██
    ██████  ██    ██ ███████ ██ ██ ██  ██ █████   ███████ ███████ ██ ████ ██ ███████ ██ ██  ██
    ██   ██ ██    ██      ██ ██ ██  ██ ██ ██           ██      ██ ██  ██  ██ ██   ██ ██  ██ ██
    ██████   ██████  ███████ ██ ██   ████ ███████ ███████ ███████ ██      ██ ██   ██ ██   ████
*/

class Librarian {
  constructor(_agent) {
    this.agent = _agent;
    _.extend(this, User, Project, VFNode);
  }

  getWorkerClass(_name) {
    switch (_name) {
      case "ProjectTemplateParser":
        return Worker_ProjectTemplateParser;
    }
  }

  getNewWorker(_userDoc, _socketSession, _name, _params, _callback, _workFinishCallback, _workErrorCallback) {
    let workerClass = this.getWorkerClass(_name);

    if (workerClass) {
      this.agent.dataStore.driver.createWork(_userDoc.id, _name, _params, (_err, _workDoc) => {
        if (_err) {

          _callback(_err, null);
        } else {
          let workInstance = new workerClass(this.agent, _userDoc, _socketSession, _workDoc, _params, _workFinishCallback, _workErrorCallback);

          _callback(null, workInstance);
        }
      });
    } else {
      throw new Error(`Worker Class'${_name} Not found.`);
    }
  }
}

export default Librarian;