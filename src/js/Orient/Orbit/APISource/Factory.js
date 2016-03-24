import APISource from './APISource';
import ICEAPISource from './ICEAPISource';
import APIFarmSource from './APIFarmSource';

class Factory {
  constructor(_orbit) {
    this.orbit = _orbit;
    //this.sourceDirPath = _options.sourceDirPath;

    this.typeSupporters = {
      'http': APISource,
      'https': APISource
    };
  }

  get sourceDirPath() {
    return this.sourceDirPath;
  }

  set sourceDirPath(_sourceDirPath) {
    this.sourceDirPath = _sourceDirPath;
  }

  registerNewType(_typeName, _class) {
    this.typeSupporters[_typeName] = _class;
  }

  getTypeClass(_typeName) {
    return this.typeSupporters[_typeName];
  }

  getInstance(_typeName, _dataObject) {
    return new(this.getTypeClass(_typeName))(_dataObject, this.orbit);
  }

  getInstanceWithRemote(_typeName, _target, _complete) {
    console.log(this.orbit);
    this.orbit.retriever.loadAPISource(_target, function(_sheet) {
      let jsonSheet;
      try {
        jsonSheet = JSON.parse(_sheet);
      } catch (_e) {
        throw _e;
      }



      console.log(_typeName, jsonSheet);
    });
  }

  static get APISource() {
    return APISource;
  }

  static get ICEAPISource() {
    return ICEAPISource;
  }

  static get APIFarmSource() {
    return APIFarmSource;
  }
}

export default Factory;