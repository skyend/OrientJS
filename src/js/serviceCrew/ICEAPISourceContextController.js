import ContextController from './ContextController.js';
import ICEAPISource from './ICEAPISource.js';
import _ from 'underscore';

export default class ICEAPISourceContextController extends ContextController {
  constructor(_ICEAPISourceData, _serviceManager) {
    super();

    this.serviceManager = _serviceManager;
    this.nodeTypeMeta = null;
    this.instance = new ICEAPISource(_ICEAPISourceData, _serviceManager);
  }

  save() {
    var self = this;
    console.log(this.instance);
    this.serviceManager.saveAPISource(this.instance.id, this.instance.export(), function(_result) {

      self.unsaved = false;
      self.context.feedSaveStateChange();
    });
  }

  checkDuplicatedRequest(_name) {
    let findedIndex = _.findIndex(this.instance.requests, {
      name: _name
    })

    if (findedIndex !== -1) {
      return true;
    }

    return false;
  }

  modifyNewRequest(_name, _crud) {
    this.instance.addNewRequest(_name, _crud);

    this.changedContent();
  }

  prepareNodeTypeMeta(_complete) {
    this.instance.prepareNodeTypeMeta(function(_nodeTypeMeta) {
      _complete(_nodeTypeMeta);
    });
  }

  getAvailableCRUDs() {
    let cruds = [];
    let crudDuplicateFilter = {};

    if (this.instance.nodeTypeMeta !== null) {

      this.instance.nodeTypeMeta.crud.map(function(_crud) {
        crudDuplicateFilter[_crud.type.toLowerCase()] = _crud.name.toLowerCase();
      });
    } else {
      alert("Not loaded NodeTypeMeta at ICEAPISourceContextController:getAvailableCRUDs");
    }

    if (crudDuplicateFilter.create === undefined) {
      crudDuplicateFilter.create = "create";
    }

    if (crudDuplicateFilter.read === undefined) {
      crudDuplicateFilter.read = "read";
    }

    if (crudDuplicateFilter.list === undefined) {
      crudDuplicateFilter.list = "list";
    }

    if (crudDuplicateFilter.update === undefined) {
      crudDuplicateFilter.update = "update";
    }

    if (crudDuplicateFilter.delete === undefined) {
      crudDuplicateFilter.delete = "delete";
    }

    if (crudDuplicateFilter.type === undefined) {
      crudDuplicateFilter.type = "type";
    }


    cruds = Object.keys(crudDuplicateFilter).map(function(_key) {
      return {
        type: _key,
        name: crudDuplicateFilter[_key]
      };
    });

    cruds.push({
      type: "*",
      name: "CRUD Free"
    });

    return cruds;
  }



  get iconURL() {
    if (this.instance.icon !== '') {
      return this.serviceManager.iceHost + '/icon/' + this.instance.icon;
    }

    return undefined;
  }
}