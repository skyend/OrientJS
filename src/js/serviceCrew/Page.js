"use strict";
import _ from 'underscore';
import Factory from './ElementNode/Factory.js';
import DocumentContextController from './DocumentContextController.js';
import async from 'async';
import Document from './Document.js';

class Page {
  constructor(_contextController, _pageDataObject, _serviceManager) {
    this.contextController = _contextController;
    this.serviceManager = _serviceManager;
    this.import(_pageDataObject);

    // runtime
    this._screenSize = {};
    this.screenMode = _contextController.screenSizing;
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

  set screenMode(_screenMode) {
    this._screenMode = _screenMode;
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

  get screenMode() {
    return this._screenMode;
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

    if (index !== -1) {
      return this.paramSupplies[index]
    }

    return {};
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

  findById(_id) {
    if (this.rootGridElement !== null) {
      return this.rootGridElement.findById(_id);
    }

    return false;
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

  modifyElementGeometry(_elementNode, _key, _value, _screenMode) {

    if (_key === 'rectangle') {
      let keys = Object.keys(_value);

      keys.map(function(_key) {
        _elementNode.setRectanglePartWithScreenMode(_key, _value[_key], _screenMode);
      });
    }

  };

  modifyGridProperty(_targetId, _name, _value) {
    let targetNode = this.rootGridElement.findById(_targetId);

    if (_name === 'name') {
      targetNode.setName(_value);
    }
  }

  modifySupplyParam(_ns, _type, _name, _value) {
    let paramIndex = _.findIndex(this.paramSupplies, {
      ns: _ns
    });

    let paramSupply = null;

    if (paramIndex === -1) {
      paramSupply = {
        ns: _ns
      };
      this.paramSupplies.push(paramSupply);
    } else {
      paramSupply = this.paramSupplies[paramIndex];
    }

    if (_type === 'single') {
      paramSupply[_name] = _value;
    } else if (_type === 'fields') {
      let fields = paramSupply.fields;
      if (fields === undefined) {
        fields = paramSupply.fields = [];
      }

      let fieldIndex = _.findIndex(fields, {
        name: _name
      });

      if (fieldIndex !== -1) {
        fields[fieldIndex] = {
          name: _name,
          value: _value
        };
      } else {
        fields.push({
          name: _name,
          value: _value
        });
      }
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

  // fragment 를 참조하는 gridElement를 찾아 참조하는 fragment의 id를 리스트로 반환한다.
  detectFollowingFragments() {
    let followingFragmentList = [];

    if (this.rootGridElement !== null) {
      this.rootGridElement.treeExplore(function(_gridElementNode) {
        if (_gridElementNode.followingFragment !== null) {
          followingFragmentList.push(_gridElementNode.followingFragment);
        }
      });
    }

    return followingFragmentList;
  }

  // fragment 리스트를 로드하여 객체로 변환한뒤 콜백으로 전달한다.
  loadFragments(_list, _complete) {
    let self = this;
    let fragments = [];

    async.eachSeries(_list, function iterator(_item, _next) {

      self.contextController.serviceManager.getDocument(_item, function(_result) {

        fragments.push(new Document(null, null, _result.document));
        _next();
      });
    }, function done(_err) {
      _complete(fragments);
    });
  }

  getSupplyNSList(_complete) {
    let followingFragmentList = this.detectFollowingFragments();

    // fragment list 로드
    this.loadFragments(followingFragmentList, function(_fragments) {
      let allFragmentsBinderNSSet = new Set();

      // Fragment 별 바인딩 셋을 구함
      let bindedFragmentStateSet = _fragments.map(function(_fragment) {

        let binderSet = _fragment.getAllBinderNSSet();

        binderSet.forEach(function(value) {
          allFragmentsBinderNSSet.add(value);
        });
      });

      _complete(allFragmentsBinderNSSet);
    });
  }

  // 상태 체크
  checkFollowingFragmentsBindEnoughState(_complete) {
    // page 가 사용하는 fragment id 리스트를 구함
    let followingFragmentList = this.detectFollowingFragments();

    // fragment list 로드
    this.loadFragments(followingFragmentList, function(_fragments) {
      // Fragment 별 바인딩 셋을 구함
      let bindedFragmentStateSet = _fragments.map(function(_fragment) {

        let binderSet = _fragment.getAllBinderNSSet();

        // param Supply 를 확인하여 값이 적당히 채워져 있다면 enough 를 true로 하여 반환한다.
        // 해야함

        return {
          enough: false,
          fragmentId: _fragment.id
        };
      });

      _complete(bindedFragmentStateSet);
    });
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
    let self = this;
    let keys = Object.keys(_paramSupply);
    let result;


    if (_paramSupply.method === 'request') {
      let apiSourceId = _paramSupply.apiSourceId;
      let requestId = _paramSupply.requestId;

      let apiSourceIndex = _.findIndex(this.preparedAPISourceList, {
        id: apiSourceId
      });

      let apiSource = this.preparedAPISourceList[apiSourceIndex];
      if (apiSource === undefined) {
        alert("API Source " + apiSourceId + " 를 찾지 못 했습니다. ");
        return;
      }
      let requestIndex = _.findIndex(apiSource.requests, {
        id: requestId
      });

      if (requestIndex === -1) {
        alert("API Source 의 요청을 찾지 못했습니다. ICEAPISource[" + apiSource.title + "] 의 설정을 확인하여 주세요.");
        return;
      }

      let request = apiSource.requests[requestIndex];


      let fields = {};
      request.fields.map(function(_requestField) {
        let index = _.findIndex(_paramSupply.fields, {
          name: _requestField.key
        });

        if (index !== -1) {
          fields[_requestField.key] = self.interpret(_paramSupply.fields[index].value || '');
        }
      });

      apiSource.executeRequest(requestId, fields, undefined, function(_result) {
        result = _result;

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
      rootGridElement: this.rootGridElement !== null ? _.clone(this.rootGridElement.export()) : undefined,
      requiredNSCache: [], // 추후에 불필요한 ParamSupply 가 호출되는것을 막기 위해 page를 저장 할 때 마다 이 필드를 갱신한다. // 갱신방법으로는 page가 필요한 NameSpace 바인딩을 얻어와 갱신 하는 방법이 있다.
    };
  }
}

export default Page;