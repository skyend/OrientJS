import _ from 'underscore';
import Identifier from '../../util/Identifier.js';

export default class Request {
  constructor(_requestData) {

    this.import(_requestData);
  }

  get crudPoint() {
    return this.crudType + '.json';
  }

  get crudType() {
    if (this.crud === '*') {
      return this.customCrud;
    } else {
      return this.crud;
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
    let foundIndex = _.findIndex(this.fields, {
      id: _id
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
    this.fields = requestData.fields || [];
    this.isVirtual = requestData.isVirtual;
  }

  export () {
    return {
      id: this.id,
      name: this.name,
      method: this.method,
      crud: this.crud,
      customCrud: this.customCrud,
      fields: _.clone(this.fields),
      isVirtual: this.isVirtual
    };
  }
}