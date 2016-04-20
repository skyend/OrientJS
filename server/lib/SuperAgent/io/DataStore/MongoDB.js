import Mongoose from 'mongoose';
import uuid from 'uuid';
import bcrypt from 'bcrypt-nodejs';

/**
 * Schema Imports
 */
import UserSchema from './MongoDB/mgSchema/user.js';
import EmailCertificationSchema from './MongoDB/mgSchema/email_certify_queue.js';

const MongooseSchemas = {
  'user': UserSchema,
  'EmailCertification': EmailCertificationSchema
};


class MongoDBDriver {
  constructor(_config) {
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


  /*
     ██████ ██████  ██    ██ ██████
    ██      ██   ██ ██    ██ ██   ██
    ██      ██████  ██    ██ ██   ██
    ██      ██   ██ ██    ██ ██   ██
     ██████ ██   ██  ██████  ██████   s
  */
  createUser(_userData, _callback) {
    let UserModel = this.getModel('user');
    UserModel.create(_userData, function(_err, _doc) {
      if (_err !== null) {

        agent.log.error("Mongodb Fail createUser");
        _callback(_err, null);
      } else {

        agent.log.info("Mongodb Created New User");
        _callback(null, _doc);
      }
    })
  }

  updateUser(_condition, _descObject, _callback) {
    let UserModel = this.getModel('user');

    UserModel.findOneAndUpdate(_condition, _descObject, (_err, _userData) => {
      if (_err !== null) {

        agent.log.error("Mongodb Fail update user");
        _callback(_err, null);
      } else {

        _callback(null, _userData);
      }
    });
  }

  updateUserById(_id, _descObject, _callback) {
    this.updateUser({
      _id: _id
    }, _descObject, (_err, _userData) => {
      _callback(_err, _userData);
    });
  }

  getUserCount(_callback) {
    let UserModel = this.getModel('user');
    UserModel.count(function(_err, _c) {
      if (_err !== null) {
        agent.log.error("Mongodb Get User Count :" + _err);
      }

      _callback(_err, _c);
    });
  }

  getUserByEmail(_email, _callback) {
    let UserModel = this.getModel('user');
    UserModel.findOne({
      email: _email
    }, function(_err, _userDoc) {
      if (_err !== null) {
        agent.log.error("MongoDB get user by email :[" + _email + "] " + _err);
      }

      _callback(_err, _userDoc);
    });
  }

  getUserById(_id, _callback) {
    let UserModel = this.getModel('user');
    UserModel.findOne({
      _id: _id
    }, function(_err, _userDoc) {
      if (_err !== null) {
        agent.log.error("MongoDB get user by id :[" + _id + "] " + _err);
      }

      _callback(_err, _userDoc);
    });
  }

  createUserEmailCertification(_id, _callback) {
    let key = uuid.v4() + uuid.v1() + uuid.v4();

    let ECModel = this.getModel('EmailCertification');

    ECModel.create({
      user_id: _id,
      key: key,
      issue_date: new Date()
    }, (_err, _certi) => {
      if (_err !== null) {
        agent.log.error("MongoDB create email certification :" + _err);
      }

      _callback(_err, _certi);
    });
  }

  getEmailCertification(_key, _callback) {
    let ECModel = this.getModel('EmailCertification');

    ECModel.findOne({
      key: _key
    }, function(_err, _cert) {
      if (_err !== null) {
        agent.log.error("MongoDB findOne email certification key [" + _key + "]:" + _err);
      }

      _callback(_err, _cert);
    });
  }

  deleteEmailCertification(_key, _callback) {
    let ECModel = this.getModel('EmailCertification');

    ECModel.findOneAndRemove({
      key: _key
    }, function(_err, _cert) {
      if (_err !== null) {
        agent.log.error("MongoDB remove email certification key [" + _key + "]:" + _err);
      }

      _callback(_err, _cert);
    });
  }
}

export default MongoDBDriver;