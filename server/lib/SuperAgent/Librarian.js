import User from './LibrarianExploded/User.js';
import Project from './LibrarianExploded/Project.js';

import Async from 'async';
import filter from 'object-key-filter';
import _ from 'underscore';
import uuid from 'uuid';
import bcrypt from 'bcrypt-nodejs';



class Librarian {
  constructor(_agent) {
    this.agent = _agent;
    _.extend(this, User, Project);
  }
}

export default Librarian;