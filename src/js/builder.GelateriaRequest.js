import Cookie from "js-cookie";
import request from 'superagent';

class GelateriaRequest {
  constructor() {
    this.hasCertification = false;

  }

  getCertification(_userid, _userpw) {

    this.hasCertification = true;
  }

  createProject(_token, _name, _complete) {
    request.post("http://localhost:3000/projects/" + ["new"].join("/"))
      .type('form')
      .send({
        authorityToken: _token,
        projectName: _name
      })
      .end(function(err, res) {


        if (err !== null) throw new Error("Project create fail");

        //console.log(res);
        var dataObject = JSON.parse(res.text);

        _complete(dataObject);
      });
  }

  loadProject(_id) {

  }

  loadProjectListByAuthorityToken(_token, _complete) {
    request.post("http://localhost:3000/projects/" + ["list-by-token"].join("/"))
      .type('form')
      .send({
        authorityToken: _token
      })
      .end(function(err, res) {


        if (err !== null) throw new Error("load Project list fail");

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

  registerUser(_userspec, _complete) {
    request.post("http://localhost:3000/" + ["users", 'register'].join("/"))
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
    request.post("http://localhost:3000/" + ["users", 'signin'].join("/"))
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

  loadUserData(_authorityToken, _complete) {
    request.post("http://localhost:3000/" + ["users", 'read-by-token'].join("/"))
      .type('form')
      .send({
        authorityToken: _authorityToken
      })
      .end(function(err, res) {
        if (err !== null) throw new Error("UserData Load fail");

        _complete(JSON.parse(res.text));
      });
  }
}

export default GelateriaRequest;