import Cookie from "js-cookie";
import request from 'superagent';

class GelateriaRequest {
  constructor() {
    this.hasCertification = false;

  }

  getCertification(_userid, _userpw) {

    this.hasCertification = true;
  }

  loadProject(_id) {

  }

  loadService(_idx, _complete) {
    request.get("http://localhost:3000/services/" + [_idx, "retrieve"].join("/"))
      .end(function(err, res) {


        if (err !== null) throw new Error("ServiceMeta Load fail");
        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  loadDocumentMetas(_serviceIdx, _complete) {
    request.get("http://localhost:3000/documents/" + [_serviceIdx, "listInService"].join("/"))
      .end(function(err, res) {


        if (err !== null) throw new Error("ServiceMeta Load fail");
        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  loadDocument(_serviceIdx, _docIdx, _complete) {
    request.get("http://localhost:3000/" + ["documents", _serviceIdx, _docIdx, "retrieve"].join("/"))
      .end(function(err, res) {


        if (err !== null) throw new Error("ServiceMeta Load fail");
        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  createDocument(_serviceId, _title, _type, _complete) {
    console.log('create');
    request.post("http://localhost:3000/" + ["documents", 'new'].join("/"))
      .type('form')
      .send({
        serviceId: _serviceId,
        title: _title,
        type: _type
      })
      .end(function(err, res) {


        if (err !== null) throw new Error("ServiceMeta Load fail");
        //console.log(res);
        //var dataObject = JSON.parse(res.text);

        //_complete(dataObject);
      });
  }

  loadPage(_id) {

  }
}

export default GelateriaRequest;