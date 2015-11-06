import _ from 'underscore';

export default class Request {
  constructor(_requestData) {
    this.lookNodeTypeData;
    this.propertytypes;
    this.method = _requestData.method || 'get';
    this.fieldFillFromNodeType = _requestData.fieldFillFromNodeType;

  }

  set nodeTypeData(_nodeTypeData) {
    this.lookNodeTypeData = _nodeTypeData;
    this.propertytypes = _nodeTypeData.propertytype;
  }

  execute(_iceDriver, _fieldDatas, _headerDatas, _complete) {
    let fields = [];
    let headers = [];
    console.log('execute ');
    if (this.fieldFillFromNodeType) {
      console.log(this.fieldFillFromNodeType);
    }

  }
}