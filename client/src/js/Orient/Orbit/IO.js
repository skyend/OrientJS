class IO {
  constructor(_orbit) {
    this.orbit = _orbit;

    this.connected = false;
    this.connection = null;

    this.listenQueue = [];
  }

  connect(_socketIOClient, _url) {
    var socket = _socketIOClient.connect(_url);

    socket.on('connect', () => {

      this.connected = true;

      this.connection = socket;

      console.info('Client has connected to the server!');

      // Listen Queue
      let listen;
      for (let i = 0; i < this.listenQueue.length; i++) {
        console.log(i);
        listen = this.listenQueue[i];
        this.addListener(listen.name, listen.callback, listen.id);
      }
    });

    socket.on('disconnect', () => {

      this.connected = false;

      this.connection = null;

      console.info('The client has disconnected!');
    });

    socket.on('error', (msg) => {
      console.info('error' + msg);
    });

  }

  get connection() {
    return this._connection;
  }

  set connection(_socket) {
    this._connection = _socket;
  }

  addListener(_listenName, _callback, _id) {
    let forwardListener = function(_data) {
      _callback(_listenName, _data, this.connection);
    };

    forwardListener.id = _id;

    this.connection.on(_listenName, forwardListener);
  }

  on(_listenName, _callback, _id) {

    if (this.connected) {

      this.addListener(_listenName, _callback, _id);

      // 이미 connect된 후에 listenQueue에 담으므로 두번 리스너가 등록되지 않는다.
      this.addlistenQueue(_listenName, _callback, _id);
    } else {
      // connect 전에 등록된 listener 는 connect될 때 청취를 시작하도록 listenQueue 에 등록하여 준다.
      this.addlistenQueue(_listenName, _callback, _id);
    }
  }

  addlistenQueue(_listenName, _callback, _id) {
    this.listenQueue.push({
      name: _listenName,
      callback: _callback,
      id: _id,
    });
  }
}

export default IO;