import _ from 'underscore';
import Identifier from '../util/Identifier.js';

export default class Request {
  constructor(_requestData, _interface) {

    this.import(_requestData);

    // interface내에 속하는 request의 속성
    this.interface = _interface;
    if (this.interface !== undefined) {
      // 이것은 상속물이다
      this.isInheritance = true;
    } else {
      this.isInheritance = false;
    }
  }


  set testResultData(_result) {
    this._testResultData = _result;
    //this._testResultDataFrame = this.analysisResultDataFrame(this._testResultData);
  }


  get testResultData() {
    return this._testResultData;
  }

  set testDataFrame(_dataFrame) {
    return this._testResultDataFrame = _dataFrame;
  }

  get testDataFrame() {
    return this._testResultDataFrame;
  }

  createResultDataFrame(_resultData, _propertytpye) {
    let dataFrame = {};

    if (_resultData.items !== undefined) {
      dataFrame.items = this.makeFrame_item_field(_resultData.items, _propertytpye);
      dataFrame.count = _resultData.count;
    }

    if (_resultData.page !== undefined) {
      dataFrame.page = _resultData.page;
      dataFrame.page.pages = [_resultData.page.pages[0]];
    }

    if (_resultData.read == 1) {
      Object.keys(_propertytpye).map(function(_ptkey) {
        dataFrame[_ptkey] = _resultData[_ptkey] || _ptkey;
      });
    }

    if (_resultData.result !== undefined) {
      dataFrame.result = _resultData.result;
    }

    if (_resultData.success !== undefined) {
      dataFrame.success = _resultData.success;
    }

    return dataFrame;
  }

  makeFrame_item_field(_items, _propertytpye) {
    let sampleItems = [];

    let sampleItem = {};

    let itemData = _items[0] || {};

    Object.keys(_propertytpye).map(function(_ptkey) {
      let pt = _propertytpye[_ptkey];

      sampleItem[_ptkey] = itemData[_ptkey];
    });

    sampleItems.push(sampleItem);

    return sampleItems;
  }

  calcurateFields(_nodeTypeData) {
    let fields = [];

    this.fieldList.map(function(_field) {
      fields.push({
        name: _field.name,
        value: _field.value,
        test: _field.test
      });
    });

    if (this.fieldFillFromNodeType) {
      let pts = _nodeTypeData.propertytype;
      let ptKeys = Object.keys(pts);

      ptKeys.map(function(_key) {
        let pt = pts[_key];

        switch (pt.pid) {
          case "owner":
          case "created":
          case "modifier":
          case "changed":
            return;
        }

        fields.push({
          name: pt.pid,
          value: '${' + pt.pid + '}',
          testValue: undefined
        });
      });
    }

    return fields;
  }


  calcurateHeaders() {
    let headers = [];

    this.headerList.map(function(_header) {
      headers.push({
        name: _header.name,
        value: _header.value,
        testValue: _header.test
      });
    });

    return headers;
  }

  // getTestRequestData(_cb) {
  //   let fields = [];
  //   let headers = [];
  //
  //   console.log('execute Test');
  //
  //   if (this.fieldFillFromNodeType) {
  //     console.log(this.fieldFillFromNodeType);
  //     console.log(this.propertytypes);
  //     Object.keys(this.propertytypes).map(function(_key) {
  //       let pt = this.propertytypes[_key];
  //
  //
  //       fields.push(this.propertytypes[_key])
  //     });
  //   }
  //
  // }

  import (_requestData) {
    let requestData = _requestData || {};

    this.id = requestData.id || Identifier.genUUID();
    this.isVirtual = requestData.isVirtual || false;
    this.name = requestData.name;
    this.method = requestData.method || 'get';
    this.fieldFillFromNodeType = requestData.fieldFillFromNodeType || false;
    this.fieldList = requestData.fieldList || [];
    this.headerList = requestData.headerList || [];
    this.customUrlPattern = requestData.customUrlPattern || '';
    this.crud = requestData.crud;
  }

  export () {
    return {
      name: this.name,
      method: this.method,
      isVirtual: this.isVirtual, // 가상의 Request 인터페이스와 함께 동작한다.
      customUrlPattern: this.customUrlPattern,
      fieldFillFromNodeType: this.fieldFillFromNodeType,
      fieldList: this.fieldList,
      headerList: this.headerList
    }
  }
}