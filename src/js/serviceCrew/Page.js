"use strict";
import _ from 'underscore';
import Factory from './ElementNode/Factory.js';
import DocumentContextController from './DocumentContextController.js';

class Page {
  constructor(_contextController, _pageDataObject, _serviceManager) {
    this.contextController = _contextController;
    this.serviceManager = _serviceManager;
    this.import(_pageDataObject);

    // runtime
    this._screenSize = {};
  }

  set title(_title) {
    this._title = _title;
  }

  set id(_id) {
    this._id = _id;
  }

  set created(_created) {
    this._created = _created;
  }

  set updated(_updated) {
    this._updated = _updated;
  }

  set rootGridElement(_rootGridElement) {
    this._rootGridElement = _rootGridElement;
  }

  set screenSize(_screenSize) {
    this._screenSize = _screenSize;
    console.log('::setScreenSize', this._screenSize);
    if (this.rootGridElement !== null) {
      this.rootGridElement.screenSize = this._screenSize;
    }
  }

  set fragmentContext(_fragmentContext) {
    this._fragmentContext = _fragmentContext;
  }

  set accessPoint(_accessPoint) {
    this._accessPoint = _accessPoint;
  }

  set paramSupplies(_paramSupplies) {
    this._paramSupplies = _paramSupplies;
  }

  set preparedAPISourceList(_preparedAPISourceList) {
    this._preparedAPISourceList = _preparedAPISourceList;
  }

  set displayTitle(_displayTitle) {
    this._displayTitle = _displayTitle;
  }

  set metaList(_metaList) {
    this._metaList = _metaList;
  }

  set refScriptIdList(_refScriptIdList) {
    this._refScriptIdList = _refScriptIdList;
  }

  set refStyleIdList(_refStyleIdList) {
    this._refStyleIdList = _refStyleIdList;
  }

  set favicon(_favicon) {
    this._favicon = _favicon;
  }

  addMeta(_meta) {
    this.metaList.push(_meta);
  }

  addStyleId(_styleId) {
    this.refStyleIdList.push(_styleId);
  }

  addScriptId(_scriptId) {
    this.refScriptIdList.push(_scriptId);
  }

  setHTMLDocument(_htmlDocument) {
    this.htmlDocument = _htmlDocument;
  }

  get title() {
    return this._title;
  }

  get id() {
    return this._id;
  }

  get created() {
    return this._created;
  }

  get updated() {
    return this._updated;
  }

  get rootGridElement() {
    return this._rootGridElement;
  }

  get screenSize() {
    return this._screenSize;
  }

  get fragmentContext() {
    return this._fragmentContext;
  }

  get accessPoint() {
    return this._accessPoint || '';
  }

  get paramSupplies() {
    return this._paramSupplies;
  }

  get preparedAPISourceList() {
    return this._preparedAPISourceList || null;
  }


  get displayTitle() {
    return this._displayTitle;
  }

  get metaList() {
    return this._metaList;
  }

  get refScriptIdList() {
    return this._refScriptIdList;
  }

  get refStyleIdList() {
    return this._refStyleIdList;
  }

  get favicon() {
    return this._favicon;
  }

  getParamSupply(_NS) {
    let index = _.findIndex(this.paramSupplies, {
      ns: _NS
    });

    return this.paramSupplies[index];
  }

  // getNewGridId() {
  //   return ++this.lastGridId;
  // }

  getHTMLDocument() {
    return this.htmlDocument;
  }

  createRootGridElement() {
    this.rootGridElement = this.newGridNode('grid');
  }

  appendNewGrid(_targetId, _behavior) {
    let targetNode = this.rootGridElement.findById(_targetId);
    if (targetNode === false) throw new Error("Not found targetGridNode");

    targetNode.appendChild(this.newGridNode(_behavior));
  }

  appendBeforeNewGrid(_targetId, _behavior) {
    let targetNode = this.rootGridElement.findById(_targetId);
    if (targetNode === false) throw new Error("Not found targetGridNode");

    targetNode.insertBefore(this.newGridNode(_behavior));
  }

  appendAfterNewGrid(_targetId, _behavior) {
    let targetNode = this.rootGridElement.findById(_targetId);
    if (targetNode === false) throw new Error("Not found targetGridNode");

    targetNode.insertAfter(this.newGridNode(_behavior));
  }

  setNewGrid(_targetId, _behavior) {
    let targetNode = this.rootGridElement.findById(_targetId);
    if (targetNode === false) throw new Error("Not found targetGridNode");
    targetNode.setOneChild(this.newGridNode(_behavior));
  }

  newGridNode(_behavior) {
    let newGridNode = Factory.takeElementNode(undefined, undefined, 'grid', this);
    //newGridNode.setId(this.getNewGridId());
    newGridNode.behavior = _behavior;

    // 초기 rectangle은 width, height 모두 auto로 지정한다.
    // 자식들크기를 합하여 자신의 Container최소 크기를 계산할 때 auto 는 0으로 가정하여 계산하게 된다.
    newGridNode.setRectangle({
      desktop: {
        width: 'auto',
        height: 'auto'
      },
      tablet: {
        width: 'auto',
        height: 'auto'
      },
      mobile: {
        width: 'auto',
        height: 'auto'
      }
    });

    return newGridNode;
  }

  clearElementNode(_targetId) {
    let targetNode = this.rootGridElement.findById(_targetId);
    targetNode.clearInside();
  }

  removeElementNode(_targetId) {
    let targetNode = this.rootGridElement.findById(_targetId);

    if (targetNode === this.rootGridElement) {
      this.rootGridElement = null;
    } else {
      targetNode.remove();
    }
  }

  modiftyGridElementProp(_targetId, _fieldName, _value) {
    let targetNode = this.rootGridElement.findById(_targetId);

    switch (_fieldName) {
      case "fragmentId":
        targetNode.followingFragment = _value;
        break;
    }
  }

  modifyGridRect(_targetId, _rect) {
    let targetNode = this.rootGridElement.findById(_targetId);

    targetNode.setRectanglePart(_rect.width, 'width');
    targetNode.setRectanglePart(_rect.height, 'height');

    targetNode.setRectanglePart(_rect.minWidth, 'minWidth');
    targetNode.setRectanglePart(_rect.minHeight, 'minHeight');

    targetNode.setRectanglePart(_rect.maxWidth, 'maxWidth');
    targetNode.setRectanglePart(_rect.maxHeight, 'maxHeight');
  }

  modifyGridProperty(_targetId, _name, _value) {
    let targetNode = this.rootGridElement.findById(_targetId);

    if (_name === 'name') {
      targetNode.setName(_value);
    }
  }

  checkPrepareParamSupply(_ns) {
    let paramSupply = this.getParamSupply(_ns);

    if (paramSupply === undefined) {
      return null;
    } else {
      if (paramSupply.method === 'request') {
        console.log("데이터 검증", _ns, paramSupply, paramSupply.apiSourceId, paramSupply.requestName);

        if ((paramSupply.apiSourceId === '' || paramSupply.apiSourceId === undefined) || (paramSupply.requestName === '' || paramSupply.requestName === undefined)) {
          return false;
        }

      } else if (paramSupply.method === 'resolve-text') {
        if (paramSupply.text === undefined || paramSupply.text == '') {
          return false;
        }
      }
    }

    return true;
  }

  interpret() {
    // Todo....
  }

  getFragment(_fragmentId, _complete) {
    let self = this;
    console.log("Fragment Load", _fragmentId);
    this.serviceManager.getDocument(_fragmentId, function(_page, _context) {
      console.log('loaded', _page);

      _complete(new DocumentContextController(_page.document, self.params, self.serviceManager));
    });

  }

  addFragmentParamSupply() {
    this.paramSupplies.push({});
  }

  prepareParams(_complete) {

    console.log('paramSupplies', this.paramSupplies);
    if (this.paramSupplies === undefined) return;

    let self = this;

    if (this.preparedAPISourceList === null) {

      // apiSourceList가 준비되어 있지 않다면 로드한 후 next를 실행한다.
      this.serviceManager.getApiSourceListWithInterface(function(_apiSourceList) {
        self.preparedAPISourceList = _apiSourceList;

        next();
      });
    } else {
      next();
    }


    function next() {
      console.log('준비됨 apisource', self.preparedAPISourceList);
      let params = {};
      let paramCount = self.paramSupplies.length;
      let completeCount = 0;

      if (paramCount == 0) {
        _complete();
      }

      self.paramSupplies.map(function(_paramSupply) {
        console.log('_paramSupply', _paramSupply);

        self.paramProcessing(_paramSupply, function(_result) {
          params[_paramSupply.ns] = _result;
          completeCount++;

          if (paramCount === completeCount) {
            _complete();
            console.log("::::::: Success all params ::::::::");
            self.params = params;
          }
        });
      });
    }
  }

  paramProcessing(_paramSupply, _complete) {
    let keys = Object.keys(_paramSupply);
    let fields = [];
    let result;
    let key;

    for (let i = 0; i < keys.length; i++) {
      key = keys[i];

      if (/^field_/.test(key)) {
        fields.push({
          name: key.replace(/^field_/, ''),
          value: this.interpret(_paramSupply[key])
        });
      }
    }


    console.log('처리해 ', _paramSupply, fields);
    console.log(fields);

    if (_paramSupply.method === 'request') {
      let apiSourceId = _paramSupply.apiSourceId;
      let requestName = _paramSupply.requestName;

      let apiSourceIndex = _.findIndex(this.preparedAPISourceList, {
        id: apiSourceId
      });

      let apiSource = this.preparedAPISourceList[apiSourceIndex];

      console.log('자 이걸 처리해야되', apiSource, requestName);
      console.log('요청', apiSource.requests[requestName], fields);

      // 불필요한 필드가 삽입되어 있을 때를 대비하여 request parameter 리스트에서 제거한다.
      fields = fields.filter(function(_field) {
        let name = _field.name;
        let index = _.findIndex(apiSource.requests[requestName].fieldList, {
          name: name
        });

        if (index < 0) {
          return false;
        }
        return true;
      });

      apiSource.executeRequest(requestName, fields, undefined, function(_result) {
        result = _result;
        console.log("받았다", _result);

        _complete(result);
      });
    } else if (_paramSupply.method === 'resolve-text') {
      result = this.interpret(_paramSupply.text);
      _complete(result);
    }




  }

  // http Parameter 로 치환가능
  // 접두사 : http-param
  interpret(_text) {
    let httpParams = window.location.search.replace(/^\??/, '').split('&');
    let httpParamDic = {};


    // http Parameter 추출
    httpParams.map(function(_paramPair) {
      let splitedPair = _paramPair.split('=');

      httpParamDic[splitedPair[0]] = splitedPair[1];
    });

    // text 변환
    let text = _text.replace(/\$\{(.*?)\}/g, function(_matched, _core) {

      let result = _core.replace(/^http\-param:(.*)$/, function(_matched, _httpParamName) {

        return httpParamDic[_httpParamName];
      });

      return result;
    });

    return text;
  }

  import (_pageDataObject) {
    let data = _pageDataObject || {};

    if (data._id === undefined || data._id === '') throw new Error("아이디를 가지지 않은 Page는 객체로 import 될 수 없습니다.");

    this.id = data._id;
    this.title = data.title || 'Untitled';
    this.favicon = data.favicon;
    this.displayTitle = data.displayTitle;
    this.metaList = data.metaList || [];
    this.refStyleIdList = data.refStyleIdList || [];
    this.refScriptIdList = data.refScriptIdList || [];
    this.created = data.created;
    this.updated = data.updated || undefined;
    this.accessPoint = data.accessPoint;
    this.paramSupplies = data.paramSupplies || [];

    this._rootGridElement = data.rootGridElement !== undefined ? Factory.takeElementNode(data.rootGridElement, undefined, undefined, this) : null;
  }

  export () {
    return {
      //_id: this.id,
      title: this.title,
      favicon: this.favicon,
      displayTitle: this.displayTitle,
      metaList: this.metaList,
      refStyleIdList: this.refStyleIdList,
      refScriptIdList: this.refScriptIdList,
      created: this.created,
      updated: this.updated,
      accessPoint: this.accessPoint,
      paramSupplies: this.paramSupplies,
      rootGridElement: _.clone(this._rootGridElement.export())
    };
  }
}

export default Page;