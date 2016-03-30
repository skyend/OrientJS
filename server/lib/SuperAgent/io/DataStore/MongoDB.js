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
      agent.log.crit('Fail connect to mongoDB.');
      process.exit(1);
    });

    Mongoose.connection.once('open', () => {
      agent.log.info("mongo db connection OK.");
      _callback();
    });

    console.log(this._getModel('user'));
  }

  _getModel(_key) {
    return Mongoose.model(_key, MongooseSchemas[_key]);
  }

  findUserById(_id) {

  }
}

export default MongoDBDriver;