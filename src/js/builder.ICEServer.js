import request from 'superagent';
import _ from "underscore";

let instance = null;

class ICEServer {

  static getInstance() {
    if (instance !== null) {
      return instance;
    }
    console.error("ICEServer 인스턴스가 생성되지 않은 상태입니다. 잘못된 위치에서 호출 하였습니다.");
  }

  constructor(_host) {
    this.host = _host;
    instance = this;
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
        console.log(result);

        // 실행자가 FUNCTION인 경우 API로써 호출 할 수가 있으므로 필터링한다.
        result.items = result.items.filter(function(_crud) {
          if (_crud.executor === 'FUNCTION') {
            return true;
          }
        });

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


        _complete(err, result2);
      });
  }

  requestNodeType(_method, _nt_tid, _crud, _headerData, _fieldsData, _end) {
    var fields = {};
    console.log('field Datas', _fieldsData);

    _fieldsData.map(function(_field) {
      fields[_field.name] = _field.testValue || _field.value;
    });


    if (_method === 'get' || _method == undefined) {
      request.get(this.host + "/api/" + _nt_tid + "/" + _crud + ".json")
        .query(fields)
        .end(function(err, res) {
          if (res === undefined) {
            _end({
              result: 'fail'
            })
          } else {
            _end(res.body);
          }
        });
    }


  }
}

export default ICEServer;