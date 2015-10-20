import Cookie from "js-cookie";
import request from 'superagent';

class GelateriaRequest {
  constructor() {
    this.hasCertification = false;

  }

  createProject(_name, _complete) {
    request.post("http://125.131.88.146:8080/projects/" + ["new"].join("/"))
      .type('form')
      .withCredentials()
      .send({
        projectName: _name
      })
      .end(function(err, res) {


        if (err !== null) throw new Error("Project create fail");

        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }



  loadProjectList(_complete) {
    request.post("http://125.131.88.146:8080/projects/" + ["list"].join("/"))
      .type('form')
      .withCredentials()
      .send()
      .end(function(err, res) {


        if (err !== null) throw new Error("load Project list fail");

        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  createService(_project_real_id, _name, _complete) {


    request.post("http://125.131.88.146:8080/services/" + ["create"].join("/"))
      .type('form')
      .withCredentials()
      .send({
        'project_real_id': _project_real_id,
        name: _name
      })
      .end(function(err, res) {

        if (err !== null) throw new Error("Service create fail");
        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  loadServiceList(_project_real_id, _complete) {
    request.post("http://125.131.88.146:8080/projects/" + ["service-list"].join("/"))
      .type('form')
      .withCredentials()
      .send({
        'project_real_id': _project_real_id
      })
      .end(function(err, res) {

        if (err !== null) throw new Error("Service list Load fail");
        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  loadService(_idx, _complete) {
    request.get("http://125.131.88.146:8080/services/" + [_idx, "retrieve"].join("/"))
      .end(function(err, res) {


        if (err !== null) throw new Error("ServiceMeta Load fail");
        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  loadDocumentMetas(_serviceIdx, _complete) {
    request.get("http://125.131.88.146:8080/documents/" + [_serviceIdx, "listInService"].join("/"))
      .end(function(err, res) {


        if (err !== null) throw new Error("ServiceMeta Load fail");
        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  loadDocument(_service_real_id, _docId, _complete) {
    console.log("Service REAL ID", _service_real_id);
    request.post("http://125.131.88.146:8080/documents/" + ["retrieve"].join("/"))
      .type('form')
      .withCredentials()
      .send({
        'service_real_id': _service_real_id,
        'document_id': _docId
      })
      .end(function(err, res) {
        console.log(err, res);
        if (err !== null) throw new Error("document load fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });

    // request.get("http://125.131.88.146:8080/" + ["documents", _serviceIdx, _docId, "retrieve"].join("/"))
    //   .end(function(err, res) {
    //
    //
    //     if (err !== null) throw new Error("ServiceMeta Load fail");
    //     //console.log(res);
    //     var dataObject = JSON.parse(res.text);
    //
    //     _complete(dataObject);
    //   });
  }


  saveDocument(_serviceId, _document_id, _documentDataObject, _complete) {
    request.post("http://125.131.88.146:8080/" + ["documents", 'save'].join("/"))
      .type('form')
      .withCredentials()
      .send({
        service_real_id: _serviceId,
        document_id: _document_id,
        document: JSON.stringify(_documentDataObject)
      })
      .end(function(err, res) {


        if (err !== null) throw new Error("save document fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  createDocument(_serviceId, _title, _type, _complete) {
    console.log('create');
    request.post("http://125.131.88.146:8080/" + ["documents", 'create'].join("/"))
      .type('form')
      .withCredentials()
      .send({
        serviceId: _serviceId,
        title: _title,
        type: _type
      })
      .end(function(err, res) {


        if (err !== null) throw new Error("create document fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }



  createPage(_serviceId, _title, _complete) {
    console.log('create');
    request.post("http://125.131.88.146:8080/" + ["pages", 'create'].join("/"))
      .type('form')
      .withCredentials()
      .send({
        serviceId: _serviceId,
        title: _title
      })
      .end(function(err, res) {

        if (err !== null) throw new Error("create page fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  getDocumentList(_serviceId, _complete) {
    request.post('http://125.131.88.146:8080/' + ['documents', 'list'].join('/'))
      .type('form')
      .withCredentials()
      .send({
        serviceId: _serviceId,
      })
      .end(function(err, res) {
        if (err !== null) throw new Error("fail load get document list");

        var dataObject = JSON.parse(res.text);
        _complete(dataObject);
      });
  }

  getPageList(_serviceId, _complete) {
    request.post('http://125.131.88.146:8080/' + ['pages', 'list'].join('/'))
      .type('form')
      .withCredentials()
      .send({
        serviceId: _serviceId,
      })
      .end(function(err, res) {
        if (err !== null) throw new Error("fail load get page list");

        var dataObject = JSON.parse(res.text);
        _complete(dataObject);
      });
  }

  loadPage(_service_real_id, _pageId, _complete) {
    console.log("Service REAL ID", _service_real_id);
    request.post("http://125.131.88.146:8080/pages/" + ["retrieve"].join("/"))
      .type('form')
      .withCredentials()
      .send({
        'service_real_id': _service_real_id,
        'page_id': _pageId
      })
      .end(function(err, res) {
        console.log(err, res);
        if (err !== null) throw new Error("page load fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });

    // request.get("http://125.131.88.146:8080/" + ["documents", _serviceIdx, _docId, "retrieve"].join("/"))
    //   .end(function(err, res) {
    //
    //
    //     if (err !== null) throw new Error("ServiceMeta Load fail");
    //     //console.log(res);
    //     var dataObject = JSON.parse(res.text);
    //
    //     _complete(dataObject);
    //   });
  }

  createApisource(_serviceId, _title, _nt_tid, _icon, _nid, _complete) {

    request.post("http://125.131.88.146:8080/" + ["apisources", 'create'].join("/"))
      .type('form')
      .withCredentials()
      .send({
        serviceId: _serviceId,
        title: _title,
        nt_tid: _nt_tid,
        icon: _icon,
        nid: _nid
      })
      .end(function(err, res) {


        if (err !== null) throw new Error("create apisource fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  getApisourceList(_serviceId, _complete) {
    request.post('http://125.131.88.146:8080/' + ['apisources', 'list'].join('/'))
      .type('form')
      .withCredentials()
      .send({
        serviceId: _serviceId,
      })
      .end(function(err, res) {
        if (err !== null) throw new Error("fail load get apisources list");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  loadApisource(_service_real_id, _apisourceId, _complete) {
    console.log("Service REAL ID", _service_real_id);
    request.post("http://125.131.88.146:8080/apisources/" + ["retrieve"].join("/"))
      .type('form')
      .withCredentials()
      .send({
        'service_real_id': _service_real_id,
        'apisource_id': _apisourceId
      })
      .end(function(err, res) {
        console.log(err, res);
        if (err !== null) throw new Error("apisource load fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  createAPIInterface(_serviceId, _title, _complete) {
    console.log('create');
    request.post("http://125.131.88.146:8080/" + ["apiinterface", 'create'].join("/"))
      .type('form')
      .withCredentials()
      .send({
        serviceId: _serviceId,
        title: _title
      })
      .end(function(err, res) {

        if (err !== null) throw new Error("create apiinterface fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  getAPIInterfaceList(_serviceId, _complete) {
    request.post('http://125.131.88.146:8080/' + ['apiinterface', 'list'].join('/'))
      .type('form')
      .withCredentials()
      .send({
        serviceId: _serviceId,
      })
      .end(function(err, res) {
        if (err !== null) throw new Error("fail load get apiinterface list");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  loadApiinterface(_service_real_id, _apiinterfaceId, _complete) {
    console.log("Service REAL ID", _service_real_id);
    request.post("http://125.131.88.146:8080/apiinterface/" + ["retrieve"].join("/"))
      .type('form')
      .withCredentials()
      .send({
        'service_real_id': _service_real_id,
        'apiinterface_id': _apiinterfaceId
      })
      .end(function(err, res) {
        console.log(err, res);
        if (err !== null) throw new Error("apiinterface load fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }


  registerUser(_userspec, _complete) {
    request.post("http://125.131.88.146:8080/" + ["users", 'register'].join("/"))
      .type('form')
      .send({
        userid: _userspec.id,
        name: _userspec.name,
        email: _userspec.email,
        password: _userspec.password
      })
      .end(function(err, res) {
        if (err !== null) throw new Error("Register Load fail");
        _complete(JSON.parse(res.text));
      });
  }

  signinUser(_id, _password, _complete) {
    request.post("http://125.131.88.146:8080/" + ["users", 'signin'].join("/"))
      .type('form')
      .send({
        userid: _id,
        password: _password
      })
      .end(function(err, res) {
        if (err !== null) throw new Error("Register Load fail");
        _complete(JSON.parse(res.text));
      });
  }

  loadUserData(_complete) {
    request.post("http://125.131.88.146:8080/" + ["users", 'read'].join("/"))
      .type('form')
      .withCredentials()
      .send()
      .end(function(err, res) {
        if (err !== null) throw new Error("UserData Load fail");

        _complete(JSON.parse(res.text));
      });
  }
}

export default GelateriaRequest;