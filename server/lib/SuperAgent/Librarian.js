import User from './LibrarianExploded/User.js';
import Project from './LibrarianExploded/Project.js';

import Async from 'async';
import filter from 'object-key-filter';
import _ from 'underscore';
import uuid from 'uuid';
import bcrypt from 'bcrypt-nodejs';

// Workers
import Worker_TemplateParser from './Worker/TemplateParser';


class Librarian {
  constructor(_agent) {
    this.agent = _agent;
    _.extend(this, User, Project);
  }

  getWorkerClass(_name) {
    switch (_name) {
      case "TemplateParser":
        return Worker_TemplateParser;
    }
  }

  getNewWorker(_name, _params) {
    let workerClass = this.getWorkerClass(_name);

    if (workerClass) {
      return new workerClass(this.agent, _params);
    } else {
      throw new Error(`Worker Class'${_name} Not found.`);
    }
  }
}

export default Librarian;