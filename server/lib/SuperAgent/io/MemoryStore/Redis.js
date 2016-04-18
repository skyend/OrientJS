import Redis from 'redis';
import uuid from 'uuid';
import bcrypt from 'bcrypt-nodejs';


class RedisDriver {
  constructor(_config) {
    this.config = _config;
  }

  connect(_callback) {
    let url;
    if (this.config.id && this.config.pw) {
      url = `redis://${this.config.id}:${this.config.pw}@${this.config.host}:${this.config.port || '6379'}/${this.config.db}`;
    } else {
      url = `redis://${this.config.host}:${this.config.port || '6379'}/${this.config.db}`;
    }
    //[redis:]//[user][:password@][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]

    // connecting
    let client = Redis.createClient(url);
    this.client = client;
    client.on('error', () => {
      agent.log.error('Fail connect to redis.');
    });

    client.on('connect', () => {
      agent.log.info("redis connection OK.");
      _callback();
    });

    // client.set("string key", "string val", Redis.print);
    // client.hset("hash key", "hashtest 1", "some value", Redis.print);
    // client.hset(["hash key", "hashtest 2", "some other value"], Redis.print);
    // client.hkeys("hash key", function(err, replies) {
    //   console.log(replies.length + " replies:");
    //   replies.forEach(function(reply, i) {
    //     console.log("    " + i + ": " + reply);
    //   });
    //   client.quit();
    // });
  }

  /*
     ██████ ██████  ██    ██ ██████
    ██      ██   ██ ██    ██ ██   ██
    ██      ██████  ██    ██ ██   ██
    ██      ██   ██ ██    ██ ██   ██
     ██████ ██   ██  ██████  ██████
  */

  createSession(_dataObj, _callback) {
    let sessionKey = bcrypt.hashSync(uuid.v1() + uuid.v4());

    this.client.hset('session', sessionKey, JSON.stringify(_dataObj), (_err, _res) => {
      _callback(_err, sessionKey);
    });
  }
}

export default RedisDriver;