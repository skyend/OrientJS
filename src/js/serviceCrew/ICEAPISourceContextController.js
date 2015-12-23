"use strict";
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
    });

    if (findedIndex !== -1) {
      return true;
    }

    return false;
  }

  modifyNewRequest(_name, _crud) {
    this.instance.addNewRequest(_name, _crud);

    this.changedContent();
  }

  modifyRequestCRUD(_requestId, _crudType) {

    if (this.instance.changeRequestCRUD(_requestId, _crudType)) {
      this.changedContent();
    } else {
      this.builderNotify("CRUD를 변경 할 수 없습니다.", "해당 요청이 존재하는지 확인하여 주세요.");
    }
  }

  modifyRequestCustomCRUD(_requestId, _crudType) {

    if (this.instance.changeRequestCustomCRUD(_requestId, _crudType)) {
      this.changedContent();
    } else {
      this.builderNotify("CRUD를 변경 할 수 없습니다.", "해당 요청이 존재하는지 확인하여 주세요.");
    }
  }

  modifyRequestCustomURL(_requestId, _customURL) {
    if (this.instance.changeRequestCustomURL(_requestId, _customURL)) {
      this.changedContent();
    } else {
      this.builderNotify("커스텀URL을 변경 할 수 없습니다.", "해당 요청이 존재하는지 확인하여 주세요.");
    }
  }

  modifyRequestMethod(_requestId, _method) {
    if (this.instance.changeRequestMethod(_requestId, _method)) {
      this.changedContent();
    } else {
      this.builderNotify("Method를 변경 할 수 없습니다.", "해당 요청이 존재하는지 확인하여 주세요.");
    }
  }

  modifyRequestNewField(_requestId) {
    if (this.instance.requestNewField(_requestId)) {
      this.changedContent();
    } else {
      this.builderNotify("Method를 변경 할 수 없습니다.", "해당 요청이 존재하는지 확인하여 주세요.");
    }
  }

  modifyRequestFieldName(_requestId, _fieldId, _value) {
    if (this.instance.changeRequestFieldKey(_requestId, _fieldId, _value)) {
      this.changedContent();
    } else {
      this.builderNotify("Method를 변경 할 수 없습니다.", "해당 요청이 존재하는지 확인하여 주세요.");
    }
  }

  modifyRequestFieldValue(_requestId, _fieldId, _value) {
    if (this.instance.changeRequestFieldValue(_requestId, _fieldId, _value)) {
      this.changedContent();
    } else {
      this.builderNotify("Method를 변경 할 수 없습니다.", "해당 요청이 존재하는지 확인하여 주세요.");
    }
  }

  modifyRequestFieldTestValue(_requestId, _fieldId, _value) {
    if (this.instance.changeRequestFieldTestValue(_requestId, _fieldId, _value)) {
      this.changedContent();
    } else {
      this.builderNotify("Method를 변경 할 수 없습니다.", "해당 요청이 존재하는지 확인하여 주세요.");
    }
  }

  modifyRemoveRequestField(_requestId, _fieldId) {
    if (this.instance.removeRequestField(_requestId, _fieldId)) {
      this.changedContent();
    } else {
      this.builderNotify("Method를 변경 할 수 없습니다.", "해당 요청이 존재하는지 확인하여 주세요.");
    }
  }

  modifyRemoveRequest(_requestId) {
    if (this.instance.removeRequest(_requestId)) {
      this.changedContent();
    } else {
      this.builderNotify("Method를 변경 할 수 없습니다.", "해당 요청이 존재하는지 확인하여 주세요.");
    }
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
      name: "요청 유형 자유 입력"
    });

    cruds.push({
      type: "**",
      name: "요청 URL 직접 입력"
    });

    return cruds;
  }



  get iconURL() {
    if (this.instance.icon !== '') {
      return this.serviceManager.iceHost + '/icon/' + this.instance.icon;
    }

    return undefined;
  }


  executeTestRequest(_requestId, _complete) {
    this.instance.executeTestRequest(_requestId, _complete);
  }
}