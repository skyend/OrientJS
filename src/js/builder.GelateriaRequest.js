import Cookie from "js-cookie";
import request from 'superagent';

class GelateriaRequest {
  constructor() {
    this.hasCertification = false;

  }

  createProject(_name, _complete) {
    request.post("http://localhost:3000/projects/" + ["new"].join("/"))
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
    request.post("http://localhost:3000/projects/" + ["list"].join("/"))
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


    request.post("http://localhost:3000/services/" + ["create"].join("/"))
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
    request.post("http://localhost:3000/projects/" + ["service-list"].join("/"))
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

  loadDocument(_service_real_id, _docId, _complete) {
    console.log("Service REAL ID", _service_real_id);
    request.post("http://localhost:3000/documents/" + ["retrieve"].join("/"))
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

    // request.get("http://localhost:3000/" + ["documents", _serviceIdx, _docId, "retrieve"].join("/"))
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
    request.post("http://localhost:3000/" + ["documents", 'save'].join("/"))
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
    request.post("http://localhost:3000/" + ["documents", 'create'].join("/"))
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
    request.post("http://localhost:3000/" + ["pages", 'create'].join("/"))
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
    request.post('http://localhost:3000/' + ['documents', 'list'].join('/'))
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
    request.post('http://localhost:3000/' + ['pages', 'list'].join('/'))
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
    request.post("http://localhost:3000/pages/" + ["retrieve"].join("/"))
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

    // request.get("http://localhost:3000/" + ["documents", _serviceIdx, _docId, "retrieve"].join("/"))
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



  registerUser(_userspec, _complete) {
    request.post("http://localhost:3000/" + ["users", 'register'].join("/"))
      .type('form')
      .withCredentials()
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
    request.post("http://localhost:3000/" + ["users", 'signin'].join("/"))
      .type('form')
      .withCredentials()
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
    request.post("http://localhost:3000/" + ["users", 'read'].join("/"))
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