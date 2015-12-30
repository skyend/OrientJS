import Cookie from "js-cookie";
import request from 'superagent';

class GelateriaRequest {
  constructor(_host) {
    this.host = _host;

  }

  createProject(_name, _complete) {
    request.post("http://" + this.host + "/projects/" + ["new"].join("/"))
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
    request.post("http://" + this.host + "/projects/" + ["list"].join("/"))
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


    request.post("http://" + this.host + "/services/" + ["create"].join("/"))
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
    request.post("http://" + this.host + "/projects/" + ["service-list"].join("/"))
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
    request.get("http://" + this.host + "/services/" + [_idx, "retrieve"].join("/"))
      .end(function(err, res) {


        if (err !== null) throw new Error("ServiceMeta Load fail");
        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  loadDocumentMetas(_serviceIdx, _complete) {
    request.get("http://" + this.host + "/documents/" + [_serviceIdx, "listInService"].join("/"))
      .end(function(err, res) {


        if (err !== null) throw new Error("ServiceMeta Load fail");
        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  loadDocument(_service_real_id, _docId, _complete) {
    console.log("Service REAL ID", _service_real_id);
    request.post("http://" + this.host + "/documents/" + ["retrieve"].join("/"))
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

    // request.get("http://"+this.host+"/" + ["documents", _serviceIdx, _docId, "retrieve"].join("/"))
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
    request.post("http://" + this.host + "/" + ["documents", 'save'].join("/"))
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
    request.post("http://" + this.host + "/" + ["documents", 'create'].join("/"))
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

  getDocumentList(_withContent, _serviceId, _complete) {
    request.post("http://" + this.host + "/" + ['documents', 'list'].join('/'))
      .type('form')
      .withCredentials()
      .send({
        serviceId: _serviceId,
        wc: (_withContent ? 'true' : 'false')
      })
      .end(function(err, res) {
        if (err !== null) throw new Error("fail load get document list");

        var dataObject = JSON.parse(res.text);
        _complete(dataObject);
      });
  }




  createPage(_serviceId, _title, _complete) {
    console.log('create');
    request.post("http://" + this.host + "/" + ["pages", 'create'].join("/"))
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


  getPageList(_serviceId, _complete) {
    request.post("http://" + this.host + "/" + ['pages', 'list'].join('/'))
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
    request.post("http://" + this.host + "/pages/" + ["retrieve"].join("/"))
      .type('form')
      .withCredentials()
      .send({
        'service_real_id': _service_real_id,
        'page_id': _pageId
      })
      .end(function(err, res) {
        console.log(err, res);
        if (err !== null) throw new Error("page load fail");

        _complete(res.body);
      });

    // request.get("http://"+this.host+"/" + ["documents", _serviceIdx, _docId, "retrieve"].join("/"))
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

  findPageBy(_serviceId, _field, _value, _complete) {

    request.get("http://" + this.host + "/" + ["pages", _serviceId, "findBy", _field, _value].join("/"))
      //.withCredentials()
      .end(function(err, res) {
        if (err !== null) throw new Error("page load fail");

        _complete(res.body);
      });
  }

  savePage(_serviceId, _page_id, _pageDataObject, _complete) {
    console.log('do save');
    request.post("http://" + this.host + "/" + ["pages", 'save'].join("/"))
      .type('form')
      .withCredentials()
      .send({
        service_real_id: _serviceId,
        page_id: _page_id,
        page: JSON.stringify(_pageDataObject)
      })
      .end(function(err, res) {
        if (err !== null) throw new Error("save page fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  createApisource(_serviceId, _title, _nt_tid, _icon, _nid, _complete) {

    request.post("http://" + this.host + "/" + ["apisources", 'create'].join("/"))
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

  createCSS(_serviceId, _name, _complete) {
    request.post("http://" + this.host + "/" + ['css', 'create'].join('/'))
      .type('form')
      .withCredentials()
      .send({
        serviceId: _serviceId,
        name: _name
      })
      .end(function(err, res) {
        if (err !== null) throw new Error("fail create CSS ");

        _complete(res.body);
      });
  }

  getCSSList(_withContent, _serviceId, _complete) {
    request.get("http://" + this.host + "/" + ['css', 'list'].join('/') + "?serviceId=" + _serviceId + '&wc=' + (_withContent ? 'true' : 'false'))
      .end(function(err, res) {
        if (err !== null) throw new Error("fail load get CSS list");

        _complete(res.body);
      });
  }

  createJS(_serviceId, _name, _complete) {
    request.post("http://" + this.host + "/" + ['js', 'create'].join('/'))
      .type('form')
      .withCredentials()
      .send({
        serviceId: _serviceId,
        name: _name
      })
      .end(function(err, res) {
        if (err !== null) throw new Error("fail create JS ");

        _complete(res.body);
      });
  }

  getJSList(_withContent, _serviceId, _complete) {
    request.get("http://" + this.host + "/" + ['js', 'list'].join('/') + "?serviceId=" + _serviceId + '&wc=' + (_withContent ? 'true' : 'false'))
      .end(function(err, res) {
        if (err !== null) throw new Error("fail load get JS list");

        _complete(res.body);
      });
  }

  getStaticList(_serviceId, _complete) {
    request.get("http://" + this.host + "/" + ['static-store', 'list'].join('/') + "?serviceId=" + _serviceId)
      .end(function(err, res) {
        if (err !== null) throw new Error("fail load get Static list");

        _complete(res.body);
      });
  }

  getComponentList(_withContent, _projectId, _complete) {
    request.get("http://" + this.host + "/" + ['components', 'list'].join('/') + "?projectId=" + _projectId + '&wc=' + (_withContent ? 'true' : 'false'))
      .end(function(err, res) {
        if (err !== null) throw new Error("fail load get component list");

        _complete(res.body);
      });
  }

  createComponent(_projectId, _name, _script, _css, _propStruct, _complete) {
    request.post("http://" + this.host + "/" + ["components", 'create'].join("/"))
      .type('form')
      .send({
        projectId: _projectId,
        name: _name,
        script: _script,
        css: _css,
        propStruct: _propStruct
      })
      .end(function(err, res) {

        if (err !== null) throw new Error("create component fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  getComponent(_projectId, _id, _complete) {

    request.post("http://" + this.host + "/components/" + ["retrieve"].join("/"))
      .type('form')
      .send({
        'projectId': _projectId,
        'id': _id
      })
      .end(function(err, res) {
        console.log(err, res);
        if (err !== null) throw new Error("component load fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  saveComponent(_projectId, _id, _componentJSON, _complete) {
    request.post("http://" + this.host + "/" + ["components", 'save'].join("/"))
      .type('form')
      .send({
        projectId: _projectId,
        id: _id,
        componentJSON: JSON.stringify(_componentJSON)
      })
      .end(function(err, res) {


        if (err !== null) throw new Error("save component fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  getApisourceList(_serviceId, _complete) {
    request.post("http://" + this.host + "/" + ['apisources', 'list'].join('/'))
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
    request.post("http://" + this.host + "/apisources/" + ["retrieve"].join("/"))
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

  saveAPISource(_service_real_id, _apisource_id, _apisourceDataObject, _complete) {
    request.post("http://" + this.host + "/" + ["apisources", 'save'].join("/"))
      .type('form')
      .withCredentials()
      .send({
        service_real_id: _service_real_id,
        apisource_id: _apisource_id,
        apisource: JSON.stringify(_apisourceDataObject)
      })
      .end(function(err, res) {

        if (err !== null) throw new Error("save apiSource fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  createAPIInterface(_serviceId, _title, _complete) {
    console.log('create');
    request.post("http://" + this.host + "/" + ["apiinterfaces", 'create'].join("/"))
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
    request.post("http://" + this.host + "/" + ['apiinterfaces', 'list'].join('/'))
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
    request.post("http://" + this.host + "/apiinterfaces/" + ["retrieve"].join("/"))
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

  saveAPIInterface(_service_real_id, _apiinterface_id, _apiinterfaceDataObject, _complete) {
    request.post("http://" + this.host + "/" + ["apiinterfaces", 'save'].join("/"))
      .type('form')
      .withCredentials()
      .send({
        service_real_id: _service_real_id,
        apiinterface_id: _apiinterface_id,
        apiinterface: JSON.stringify(_apiinterfaceDataObject)
      })
      .end(function(err, res) {


        if (err !== null) throw new Error("save apiinterface fail");

        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }


  registerUser(_userspec, _complete) {
    request.post("http://" + this.host + "/" + ["users", 'register'].join("/"))
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
    request.post("http://" + this.host + "/" + ["users", 'signin'].join("/"))
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
    request.post("http://" + this.host + "/" + ["users", 'read'].join("/"))
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