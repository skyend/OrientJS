"use strict";
import ArrayHandler from '../../../util/ArrayHandler';
import ObjectExtends from '../../../util/ObjectExtends';
import Identifier from '../../../util/Identifier.js';

export default class Request {
  constructor(_requestData, _orbit) {
    this.orbit = _orbit;
    this.import(_requestData);
  }

  get crudPoint() {
    let crudType = this.crudType;
    let extension;



    if (/\.[\w\d\-\_]+$/.test(crudType)) {
      return crudType;
    } else {
      if( this.orbit ){
        extension = this.orbit.interpret( this.extension );
      }

      return crudType + '.' + (extension || 'json');
    }
  }

  get crudType() {
    if (this.crud === '*') {
      return this.orbit ? this.orbit.interpret(this.customCrud):this.customCrud;
    } else {
      return this.orbit ? this.orbit.interpret(this.crud):this.crud;
    }
  }

  addNewField() {
    this.fields.push({
      id: Identifier.genUUID(),
      key: '',
      value: '',
      testValue: ''
    });
  }

  findField(_id) {
    let foundIndex = ArrayHandler.findIndex(this.fields, function(_field) {
      return _field.id === _id
    });

    return this.fields[foundIndex];
  }

  changeFieldKey(_fieldId, _value) {
    this.findField(_fieldId).key = _value;
  }

  changeFieldValue(_fieldId, _value) {
    this.findField(_fieldId).value = _value;
  }

  changeFieldTestValue(_fieldId, _value) {
    this.findField(_fieldId).testValue = _value;
  }

  getFieldsObject() {
    let object = {};
    let result;
    for (let i = 0; i < this.fields.length; i++) {

      result = this.fields[i].value || this.fields[i].defaultValue;

      if (result && result !== '') {
        object[this.fields[i].key] = result;
      }
    }

    return object;
  }

  removeField(_fieldId) {
    let fields = [];

    this.fields = this.fields.filter(function(_field) {
      return _field.id !== _fieldId
    });
  }

  import (_requestData) {
    let requestData = _requestData || {};

    this.id = requestData.id || Identifier.genUUID();

    this.name = requestData.name;
    this.method = requestData.method || 'get';
    this.crud = requestData.crud;
    this.customCrud = requestData.customCrud;
    this.customURL = requestData.customURL;
    this.fields = requestData.fields || [];
    this.isVirtual = requestData.isVirtual;
    this.extension = requestData.extension;
  }

  export () {
    return {
      id: this.id,
      name: this.name,
      method: this.method,
      crud: this.crud,
      customCrud: this.customCrud,
      customURL: this.customURL,
      fields: ObjectExtends.clone(this.fields),
      isVirtual: this.isVirtual,
      extension: this.extension
    };
  }
}
