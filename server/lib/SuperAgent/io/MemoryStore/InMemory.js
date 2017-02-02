class InmemoryDriver {
  constructor(_config){
    this.config = _config;
    this.memoryDict = null;

  }

  connect(_cb){
    this.memoryDict = {};
    _cb();
  }

  hset(_coll, _key, _stringData, _cb){
    if( !this.memoryDict[_coll] ){
      this.memoryDict[_coll] = {};
    }

    this.memoryDict[_coll][_key] = _stringData;

    _cb(null, {});
  }

  hdel(_coll, _key, _cb){
    if( !this.memoryDict[_coll] ){
      this.memoryDict[_coll] = {}
    }

    delete this.memoryDict[_coll][_key];
    _cb(null, {});
  }

  hget(_coll, _key, _cb){
    if( !this.memoryDict[_coll] ){
      this.memoryDict[_coll] = {}
    }


    _cb(null, this.memoryDict[_coll][_key] || null);
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

    this.hset('session', sessionKey, JSON.stringify(_dataObj), (_err, _res) => {
      _callback(_err, sessionKey);
    });
  }

  removeSession(_sessionKey, _callback) {
    this.hdel('session', _sessionKey, (_err, _res) => {
      console.log(_res);
      _callback(_err);
    });
  }

  readSession(_sessionKey, _callback) {
    this.hget('session', _sessionKey, (_err, _res) => {
      _callback(_err, JSON.parse(_res));
    });
  }


}


export default InmemoryDriver;
