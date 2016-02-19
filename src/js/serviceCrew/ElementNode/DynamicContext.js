import Factory from './Factory';
import Sizzle from 'sizzle';
import ObjectExplorer from '../../util/ObjectExplorer.js';
import ObjectExtends from '../../util/ObjectExtends.js';

import SALoader from '../StandAloneLib/Loader';
import Gelato from '../StandAloneLib/Gelato';
import async from 'async';
import events from 'events';
import ICEAPISource from '../ICEAPISource';
import APIFarmSource from '../APIFarmSource';
import _ from 'underscore';
import DataResolver from '../DataResolver/Resolver';
import Identifier from '../../util/Identifier';

class DynamicContext {
  /*
    _environment -
    _props -
    ~_interpretInterfaceFollowObject - interpret 메소드를 구현한 Object를 입력한다. 현재 가능한 대상 : {}ElementNode~
  */
  constructor(_environment, _props, _upperDynamicContext /*_interpretInterfaceFollowObject*/ ) {
    //Object.assign(this, Events.EventEmitter.prototype);
    //_.extendOwn(this, Events.EventEmitter.prototype);
    ObjectExtends.liteExtends(this, events.EventEmitter.prototype);

    this.id = Identifier.genUUID();

    // 상위 dynamicContext로 입력된 resolver 를 입력함
    this.dataResolver = new DataResolver(_upperDynamicContext ? _upperDynamicContext.dataResolver : null);

    // this.environment = _environment;

    //this.interpretInterfaceFollowObject = _interpretInterfaceFollowObject || null;
    this.upperDynamicContext = _upperDynamicContext || null;
    this.params = {};

    // 모든 다중 요청의 구분은 콤마(,)로 한다.
    // 다중요청을 사용 할 때 모든 필드의 순서를 맞추어 주어야 한다.
    this.sourceIDs = _props.sourceIDs;
    this.requestIDs = _props.requestIDs;
    this.namespaces = _props.namespaces;
    this.injectParams = _props.injectParams;

    this.apisources = [];
    this.isLoading = false;
  }

  get interpretInterfaceFollowObject() {
    return this._interpretInterfaceFollowObject;
  }

  get upperDynamicContext() {
    return this._upperDynamicContext;
  }

  set interpretInterfaceFollowObject(_interpretInterfaceFollowObject) {
    this._interpretInterfaceFollowObject = _interpretInterfaceFollowObject;
  }

  set upperDynamicContext(_upperDynamicContext) {
    this._upperDynamicContext = _upperDynamicContext;
  }

  getParam(_ns) {
    return this.params[_ns];
  }

  // Object.keys($('..')[0].___en.dynamicContext.params).length > 0

  // clearInterval(itvid)
  ready(_complete) {
    let that = this;

    this.isLoading = true;
    this.emit("begin-load");
    // console.log(this.sourceIDs);
    let sourceIdList = this.sourceIDs.split(',');
    console.log(sourceIdList);
    async.eachSeries(sourceIdList, function(_id, _next) {

      // API Farm 과 ICEAPISource를 구분
      if (/^farm/.test(_id)) {
        // farm / apiFarmServiceId / serviceClassId
        let farmPathSplit = _id.split('/');
        if (farmPathSplit.length != 3) throw new Error("Invalid DynamicContext apiFarm Spec");

        let apiFarmService = farmPathSplit[1];
        let serviceClass = farmPathSplit[2];

        SALoader.loadAPIFarmSource(apiFarmService, serviceClass, function(_apiFarmSource) {
          let apiSource = new APIFarmSource(_apiFarmSource);
          apiSource.setHost(Gelato.one().page.apiFarmHost);

          that.apisources.push(apiSource);
          console.log('loaded', sourceIdList);
          _next();
        })
      } else {
        // console.log(_id, 'source id', sourceIdList);
        SALoader.loadAPISource(_id, function(_iceApiSource) {
          let apiSource = new ICEAPISource(_iceApiSource);
          apiSource.setHost(Gelato.one().page.iceHost);

          that.apisources.push(apiSource);
          _next();
        })
      }


    }, function done() {
      console.log('done', sourceIdList);
      _complete(null);
    });
  }

  dataLoad(_complete) {
    let that = this;
    let sourceIdList = this.sourceIDs.split(',');
    let requestIdList = this.requestIDs.split(',');
    let namespaceList = this.namespaces.split(',');
    let injectParams = (this.injectParams || '').split(',');

    async.eachSeries(this.apisources, function iterator(_apiSource, _next) {
      let apiSourceOrder = _.findIndex(sourceIdList, function(_idAsKey) {
        return _apiSource.key == _idAsKey;
      });

      // 없으므로 next
      if (apiSourceOrder == -1) _next()
      else {
        let paramsString = injectParams[apiSourceOrder] || '';
        let paramObject = that.parseParamString(paramsString);

        _apiSource.executeRequest(requestIdList[apiSourceOrder], paramObject, undefined, function(_result) {
          console.log(_apiSource);

          that.dataResolver.setNS(namespaceList[apiSourceOrder], _result);
          //
          // that.params[namespaceList[apiSourceOrder]] = _result;

          _next();
        });
      }
    }, function done() {
      _complete();
      that.isLoading = false;
      that.emit('complete-load');
    })
  }

  parseParamString(_paramString) {
    let paramsPairs = _paramString.split('&');
    let paramObject = {};

    let pair;
    for (let i = 0; i < paramsPairs.length; i++) {
      pair = paramsPairs[i].split('=');

      let key = pair[0];
      let value = pair[1];

      value = this.dataResolver.resolve(value || '');
      paramObject[key] = value;
    }

    return paramObject;
  }

  feedbackLoadState() {

  }

  endFeedBack() {
    this.element.removeAttribute('fix-placeholder', '');

    let placeholder = Sizzle('[is-dynamic-context-placeholder]', this.element)[0];
    placeholder.remove();
  }


  interpret(_text, externalGetterInterface, _caller) {
    var self = this;

    return this.dataResolver.resolve(_text, externalGetterInterface, null, _caller || this);
    //
    // // 바인딩 문자열 단 하나만 있을 때는 replace를 하지 않고
    // // 객체를 보존하여 반환하도록 한다.
    // if (/^\$\{.*?\}$/.test(_text)) {
    //   let matched = _text.match(/(\${(.*?)})/);
    //
    //   let signString = matched[2];
    //
    //   return this.valueResolve(signString);
    // } else {
    //   let valuesResolved = _text.replace(/\${(.*?)}(?:(\.[a-z]+))?/g, function(_matched, _signString, _optionString) {
    //     let rsvResult = self.valueResolve(_signString);
    //     console.log('resolve', rsvResult, _signString);
    //     // ${...}.optionString 과 같은 형식을 사용 하였을 때 유효한 옵션이면 옵션처리 결과를 반환하며
    //     // 유효하지 않은 옵션은 signString의 리졸브 결과와 optionString형식으로 입력된 문자열을 살려서 반환한다.
    //     // 추후에 함수 형식도 지원
    //     switch (_optionString) {
    //       case ".count":
    //         return rsvResult.length;
    //     }
    //     if (_optionString !== undefined)
    //       return rsvResult + (_optionString || '');
    //     else
    //       return rsvResult;
    //   });
    //
    //   return valuesResolved.replace(/(\%\((.*?)\))/g, function(_matched, _matched2, _formularString) {
    //
    //     return self.processingFormularBlock(_formularString);
    //   });
    // }
  }

  // valueResolve(_sign) {
  //   let self = this;
  //
  //   if (/^(\*?)([^\:^\*]*)$/.test(_sign)) {
  //     let matched = _sign.match(/^(\*?)(.*)$/);
  //     let firstMark = matched[1];
  //     let refValue = matched[2];
  //
  //
  //     if (firstMark === '*') {
  //
  //       let splited = refValue.split(/\//);
  //       let ns = splited.shift();
  //       let detail = splited.length > 0 ? splited.join('/') : undefined;
  //
  //       let param = self.getParam(ns);
  //       if (param === undefined) {
  //         return '`Error: No Param NS: ' + ns + '`';
  //       }
  //       //console.log(detail, param, splited, _refValue);
  //       ///css/contents-retrieve-by-name/custom?serviceId=56755571b88a6c2ffd90e8e9
  //       if (detail !== undefined) {
  //         return ObjectExplorer.getValueByKeyPath(param, detail) || '`Error: No Param ' + detail + ' in ' + ns + '`';
  //       } else {
  //         return param;
  //       }
  //     }
  //
  //     return '`Error: Interpret Error`';
  //   } else if (/^\w+:.*$/.test(_sign)) {
  //     let matches = _sign.match(/^(\w+):(.*)$/);
  //     let kind = matches[1];
  //     let target = matches[2];
  //
  //     if (kind === 'script') {
  //       let url = this.contextController.serviceManager.getScriptURLByName(target);
  //
  //       return url;
  //     } else if (kind === 'style') {
  //       let url = this.contextController.serviceManager.getStyleURLByName(target);
  //
  //       return url;
  //     } else if (kind === 'image') {
  //       let url = this.contextController.serviceManager.getImageURLByName(target);
  //
  //       return url;
  //     } else if (kind === 'static') {
  //       let url = this.contextController.serviceManager.getImageStaticByName(target);
  //
  //       return url;
  //     }
  //   }
  //   return '`Error: Interpret Syntax Error`';
  // }
  //
  //
  //
  // processingFormularBlock(_blockString) {
  //   let formularResult;
  //
  //   try {
  //     formularResult = eval(_blockString);
  //   } catch (_e) {
  //     formularResult = false;
  //   }
  //
  //   return formularResult;
  // }
}

export default DynamicContext;