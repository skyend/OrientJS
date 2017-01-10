import Mysql from 'mysql';
import uuid from 'uuid';
import bcrypt from 'bcrypt-nodejs';
import _ from 'underscore';


// import UserExtends from './MongoDB/MongoDBExploded/user.js';
// import ProjectExtends from './MongoDB/MongoDBExploded/project.js';
// import WorkExtends from './MongoDB/MongoDBExploded/work.js';
// import VFnodeExtends from './MongoDB/MongoDBExploded/vfnode.js';


class MongoDBDriver {
  constructor(_config) {
    // _.extend(this, UserExtends, ProjectExtends, WorkExtends, VFnodeExtends);

    this.config = _config;
  }

  connect(_callback) {
    // let url;
    // if (this.config.id && this.config.pw) {
    //   url = `mongodb://${this.config.id}:${this.config.pw}@${this.config.host}:${this.config.port || '27017'}/${this.config.db}`;
    // } else {
    //   url = `mongodb://${this.config.host}:${this.config.port || '27017'}/${this.config.db}`;
    // }
    //
    // // connecting
    // Mongoose.connect(url);
    //
    // Mongoose.connection.on('error', () => {
    //   agent.log.error('Fail connect to mongoDB.');
    // });
    //
    // Mongoose.connection.once('open', () => {
    //   agent.log.info("mongo db connection OK.");
    //   _callback();
    // });



    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'me',
      password : 'secret',
      database : 'my_db'
    });

    connection.connect();

    this.conn = connection;
  }

  // getModel(_key) {
  //   return Mongoose.model(MongooseSchemas[_key].MODEL_NAME, MongooseSchemas[_key]);
  // }

}

export default MongoDBDriver;
