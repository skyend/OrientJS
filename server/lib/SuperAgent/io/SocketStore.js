import _ from 'underscore';

class SocketStore {
  constructor(_agent) {
    this.agent = _agent;

    this.sessions = {};
  }

  registerUserSession(_sid, crypted_uid, _socket, _callback) {
    if (this.sessions[_sid] === undefined) {
      this.sessions[_sid] = {
        crypted_uid: crypted_uid,
        sockets: [_socket],
        emit: function(_subject, _data) {
          let sockets = this.sockets,
            socket;
          for (let i = 0; i < sockets.length; i++) {
            socket = sockets[i];

            socket.emit(_subject, _data);
          }
        }
      };
    } else {
      this.sessions[_sid].sockets.push(_socket);
    }

    _callback(true);
  }

  removeUserSessionBySocket(_sid, _socket, _callback) {
    if (this.sessions[_sid] === undefined) {
      this.agent.log.warning("삭제할 소켓 세션이 없습니다.");
    } else {
      if (this.sessions[_sid].sockets.length === 1) {
        delete this.sessions[_sid];

        _callback(true);
      } else {
        this.sessions[_sid].sockets = this.sessions[_sid].sockets.filter(function(_storedSocket) {
          return _storedSocket !== _socket;
        });

        _callback(true);
      }
    }
  }

  getSession(_sessionId) {
    return this.sessions[_sessionId];
  }

  // session 을 입력받고 session이 유효하면 emit
  tryEmit(_socketSession, _subject, _data) {
    if (_socketSession !== null) {
      _socketSession.emit(_subject, _data);
    }
  }
}

export default SocketStore;