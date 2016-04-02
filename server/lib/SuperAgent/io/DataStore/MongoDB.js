import Mongoose from 'mongoose';

/**
 * Schema Imports
 */
import UserSchema from './MongoDB/mgSchema/user.js';

const MongooseSchemas = {
  'user': UserSchema
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

  getUserCount(_callback) {
    let UserModel = this.getModel('user');
    UserModel.count(function(_err, _c) {
      if (_err !== null) {
        agent.log.error("Mongodb Get User Count" + _err);
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
        agent.log.error("MongoDB get user by email" + _err);
      }

      _callback(_err, _userDoc);
    });
  }
}

export default MongoDBDriver;