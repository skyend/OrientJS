export default function(_socket) {
  console.log(">>>>>>>>>>>>>>>>>>> new client connected");


  let cookies_string = _socket.handshake.headers.cookie || '';
  let cookies = {};
  cookies_string.split('; ').map(function(_cookiePair) {
    let pair = _cookiePair.split('=');

    cookies[pair[0]] = pair[1];
  });

  let sid = cookies['ion-sb.sid'];
  let crypted_uid = cookies['ion-sb.uid'];

  agent.businessMan.getUserBySession(sid, crypted_uid, function(_err, _userDoc) {

    if (_err) {
      agent.websockLog.error("Failed session authorizing. sid: %s, crypted uid: %s, Detail:%s", sid, crypted_uid, _err);
      _socket.emit("conn-status", {
        result: 'fail',
        error: _err
      });
    } else {
      agent.socketStore.registerUserSession(sid, crypted_uid, _socket, function() {
        agent.websockLog.info("Successed session authorizing. sid: %s, crypted_uid: %s, user id: %s", sid, crypted_uid, _userDoc.id);

        _socket.emit("conn-status", {
          result: 'success',
          error: null
        });
      });
    }
  });

  _socket.on('disconnect', function(data) {
    console.log(">>>>>>>>>>>>>>>>>>>   client disconnected");

    agent.socketStore.removeUserSessionBySocket(sid, _socket, function() {
      agent.websockLog.info("Successed session deauthorizing. sid: %s, crypted_uid: %s", sid, crypted_uid);
    });
  });

}