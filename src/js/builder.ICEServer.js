import request from 'superagent';
import _ from "underscore";


class ICEServer {
  constructor(_host) {
    this.host = _host;
  }

  // getPropertytypesByNid(_nid, _complete) {
  //   request.post(this.host + "/json.do")
  //     .type('form')
  //     .send({
  //       tid: 'nodetype',
  //       reltype: 'children',
  //       reftid: 'propertytype',
  //       pid: 'propertytype',
  //       method: 'select',
  //       uppernid: _nid,
  //       nid: _nid,
  //       t: 'api'
  //     })
  //     .end(function(err, res) {
  //       console.log(res);
  //       _complete(JSON.parse(res.text));
  //     });
  // }


  getCRUDByTid(_tid, _complete) {

    request.get(this.host + "/api/crud/list.json")
      .query({
        parent_equals: _tid,
        t: 'api',
      })
      .end(function(err, res) {
        var result = res.body;

        _complete(result);
      });
  }



  getPropertytypesByTid(_tid, _complete) {

    request.get(this.host + "/api/" + _tid + "/type.json")
      .query({
        t: 'api',
      })
      .end(function(err, res) {
        var result = res.body;

        _complete(result);
      });
  }

  getNodeType(_nid, _complete) {
    var self = this;
    request.get(this.host + "/api/nodetype/read.json")
      .query({
        t: 'api',
        nid: _nid
      })
      .end(function(err, res) {
        var result = res.body;


        self.getPropertytypesByTid(result.nt_tid, function(pt_res) {

          result.propertytype = pt_res.propertytypes;

          self.getCRUDByTid(result.nt_tid, function(pt_res) {

            result.crud = pt_res.items;

            _complete(result);
          });
        });

      });
  }

  getNodeAllTypes(_complete) {
    request.get(this.host + "/api/nodetype/list.json")
      .query({
        t: 'api'
      })
      .end(function(err, res) {
        var list = res.body; //JSON.parse(res.text);

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