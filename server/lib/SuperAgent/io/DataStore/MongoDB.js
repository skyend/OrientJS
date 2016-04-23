import Mongoose from 'mongoose';
import uuid from 'uuid';
import bcrypt from 'bcrypt-nodejs';
import _ from 'underscore';

/**
 * Schema Imports
 */
import UserSchema from './MongoDB/mgSchema/user.js';
import EmailCertificationSchema from './MongoDB/mgSchema/email_certify_queue.js';


import UserExtends from './MongoDB/extends/user.js';

const MongooseSchemas = {
  'user': UserSchema,
  'EmailCertification': EmailCertificationSchema
};


class MongoDBDriver {
  constructor(_config) {
    _.extend(this, UserExtends);

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