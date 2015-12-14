import _ from 'underscore';
import Identifier from '../util/Identifier.js';

export default class Request {
  constructor(_requestData, _interface) {

    this.import(_requestData);
  }


  import (_requestData) {
    let requestData = _requestData || {};

    this.id = requestData.id || Identifier.genUUID();

    this.name = requestData.name;
    this.method = requestData.method || 'get';
    this.crud = requestData.crud;
  }

  export () {
    return {
      id: this.id,
      name: this.name,
      method: this.method,
      crud: this.crud
    };
  }
}