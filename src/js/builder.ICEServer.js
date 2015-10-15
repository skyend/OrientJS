import request from 'superagent';
import _ from "underscore";

class driver {

  getNodeAllTypes() {

  }
}

class ICEServer {
  static getNodeAllTypes(_complete) {
    request.get("http://icedev.i-on.net/api/nodetype/list.json")
      .query({
        t: 'api'
      })
      .end(function(err, res) {
        var list = JSON.parse(res.text);

        // var result = _.sortBy(list.items, function(_item) {
        //   return _item.tree.nid;
        // });

        var result2 = [];
        var map = {};
        //console.log(list.items);
        for (var i = 0; i < list.items.length; i++) {
          map[list.items[i].nt_tid] = list.items[i];
          //console.log(list.items[i].nt_tid);
        }


        //console.log("Tids---------------end");
        //console.log(map);

        var item;
        for (var i = 0; i < list.items.length; i++) {
          item = list.items[i];
          //console.log(item);
          var tid = item.nt_tid;
          var parentTid = item.tree.value;
          //console.log(parentTid);

          if (parentTid == '*') {
            //console.log('------- PPP --------');
            result2.push(item);
          } else {
            //console.log('parent', map[parentTid]);
            if (map[parentTid] === undefined) continue;

            if (map[parentTid].children === undefined) {
              map[parentTid].children = [];
            }


            map[parentTid].children.push(item);
          }
        }

        //console.log(result2);

        _complete(err, result2);
      });
  }
}

export default ICEServer;