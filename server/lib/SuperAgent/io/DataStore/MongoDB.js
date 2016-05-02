import Mongoose from 'mongoose';
import uuid from 'uuid';
import bcrypt from 'bcrypt-nodejs';
import _ from 'underscore';

/**
 * Schema Imports
 */
import UserSchema from './MongoDB/mgSchema/user.js';
import EmailCertificationSchema from './MongoDB/mgSchema/email_certify_queue.js';
import ProjectScheme from './MongoDB/mgSchema/project.js';
import UserRelProjectScheme from './MongoDB/mgSchema/user_rel_project.js';
import VfnodeSchema from './MongoDB/mgSchema/vfnode.js';
import FileSchema from './MongoDB/mgSchema/file.js';
import ProjectRootVFNodeSchema from './MongoDB/mgSchema/project_root_vfnode.js';


import UserExtends from './MongoDB/MongoDBExploded/user.js';
import ProjectExtends from './MongoDB/MongoDBExploded/project.js';

const MongooseSchemas = {
  'user': UserSchema,
  'EmailCertification': EmailCertificationSchema,

  'Project': ProjectScheme,
  'UserRelProject': UserRelProjectScheme,
  'ProjectRootVFNode': ProjectRootVFNodeSchema,
  'VFNode': VfnodeSchema,
  'File': FileSchema,
};


class MongoDBDriver {
  constructor(_config) {
    _.extend(this, UserExtends, ProjectExtends);

    this.config = _config;
  }

  connect(_callback) {
    let url;
    if (this.config.id && this.config.pw) {
      url = `mongodb://${this.config.id}:${this.config.pw}@${this.config.host}:${this.config.port || '27017'}/${this.config.db}`;
    } else {
      url = `mongodb://${this.config.host}:${this.config.port || '27017'}/${this.config.db}`;
    }

    // connecting
    Mongoose.connect(url);

    Mongoose.connection.on('error', () => {
      agent.log.error('Fail connect to mongoDB.');
    });

    Mongoose.connection.once('open', () => {
      agent.log.info("mongo db connection OK.");
      _callback();
    });
  }

  getModel(_key) {
    return Mongoose.model(_key, MongooseSchemas[_key]);
  }

}

export default MongoDBDriver;