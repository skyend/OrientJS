import APISource from './APISource';

var TYPE_SUPPORTERS_POOL = {
  'http': APISource,
  'https': APISource
};


// Accept Addons

class Factory {
  constructor(_orbit) {
    this.orbit = _orbit;
    //this.sourceDirPath = _options.sourceDirPath;
  }

  get sourceDirPath() {
    return this.sourceDirPath;
  }

  set sourceDirPath(_sourceDirPath) {
    this.sourceDirPath = _sourceDirPath;
  }

  // for addon
  registerNewType(_typeName, _class) {
    TYPE_SUPPORTERS_POOL[_typeName] = _class;
  }

  static RegisterNewType(_typeName, _class) {
    TYPE_SUPPORTERS_POOL[_typeName] = _class;
  }

  getTypeClass(_typeName) {
    return TYPE_SUPPORTERS_POOL[_typeName];
  }

  getInstance(_typeName, _dataObject) {
    return new(this.getTypeClass(_typeName))(_dataObject, this.orbit);
  }

  getInstanceWithRemote(_typeName, _target, _complete) {
    let that = this;
    console.log(this.orbit);
    this.orbit.retriever.loadAPISource(_target, function(_sheet) {
      let jsonSheet;
      try {
        jsonSheet = JSON.parse(_sheet);
      } catch (_e) {
        throw _e;
      }

      _complete(that.getInstance(_typeName, jsonSheet));
    });
  }

  static get APISource() {
    return APISource;
  }
}

export default Factory;