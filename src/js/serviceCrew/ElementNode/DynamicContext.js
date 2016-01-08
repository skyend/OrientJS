import Factory from './Factory';
import Sizzle from 'sizzle';
import ObjectExplorer from '../../util/ObjectExplorer.js';
import SALoader from '../StandAloneLib/Loader';
import async from 'async';
import Events from 'events';
import ICEAPISource from '../ICEAPISource';
import _ from 'underscore';

class DynamicContext {
  constructor(_environment, _parentDynamicContext, _data) {
    Object.assign(this, Events.EventEmitter.prototype);

    this.environment = _environment;

    this.parentDynamicContext = _parentDynamicContext || null;
    this.params = {};

    this.sourceIDs = _data.sourceIDs;
    this.requestIDs = _data.requestIDs;
    this.namespaces = _data.namespaces;

    this.apisources = [];
    this.isLoading = false;
  }

  get parentDynamicContext() {
    return this._parentDynamicContext;
  }

  set parentDynamicContext(_parentDynamicContext) {
    this._parentDynamicContext = _parentDynamicContext;
  }

  getParam(_ns) {
    return this.params[_ns];
  }

  ready(_complete) {
    let that = this;

    this.isLoading = true;
    this.emit("begin-load");

    let sourceIdList = this.sourceIDs.split(',');
    async.eachSeries(sourceIdList, function(_id, _next) {
      SALoader.loadAPISource(_id, function(_apiSource) {
        let apiSource = new ICEAPISource(_apiSource);
        apiSource.setHost(that.environment.iceHost);

        that.apisources.push(apiSource);
        _next();
      })

    }, function done() {
      _complete();
    });
  }

  start(_complete) {
    let that = this;
    let sourceIdList = this.sourceIDs.split(',');
    let requestIdList = this.requestIDs.split(',');
    let namespaceList = this.namespaces.split(',');

    async.eachSeries(this.apisources, function iterator(_apiSource, _next) {
      let apiSourceOrder = _.findIndex(sourceIdList, function(_id) {
        return _apiSource.nt_tid == _id;
      });

      console.log(_apiSource, apiSourceOrder, sourceIdList);
      // 없으므로 next
      if (apiSourceOrder == -1) _next()
      else {
        _apiSource.executeRequest(requestIdList[apiSourceOrder], undefined, undefined, function(_result) {
          console.log('result ', _result);
          that.params[namespaceList[apiSourceOrder]] = _result;

          _next();
        });
      }
    }, function done() {
      _complete();
      that.isLoading = false;
      that.emit('complete-load');
    })
  }

  feedbackLoadState() {

  }

  endFeedBack() {
    this.element.removeAttribute('fix-placeholder', '');

    let placeholder = Sizzle('[is-dynamic-context-placeholder]', this.element)[0];
    placeholder.remove();
  }


  interpret(_text) {
    var self = this;

    // 바인딩 문자열 단 하나만 있을 때는 replace를 하지 않고
    // 객체를 보존하여 반환하도록 한다.
    if (/^\$\{.*?\}$/.test(_text)) {
      let matched = _text.match(/(\${(.*?)})/);

      let signString = matched[2];

      return this.valueResolve(signString);
    } else {
      let valuesResolved = _text.replace(/\${(.*?)}(?:(\.[a-z]+))?/g, function(_matched, _signString, _optionString) {
        let rsvResult = self.valueResolve(_signString);

        // ${...}.optionString 과 같은 형식을 사용 하였을 때 유효한 옵션이면 옵션처리 결과를 반환하며
        // 유효하지 않은 옵션은 signString의 리졸브 결과와 optionString형식으로 입력된 문자열을 살려서 반환한다.
        // 추후에 함수 형식도 지원
        switch (_optionString) {
          case ".count":
            return rsvResult.length;
        }
        if (_optionString !== undefined)
          return rsvResult + (_optionString || '');
        else
          return rsvResult;
      });

      return valuesResolved.replace(/(\%\((.*?)\))/g, function(_matched, _matched2, _formularString) {

        return self.processingFormularBlock(_formularString);
      });
    }
  }

  valueResolve(_sign) {
    let self = this;

    if (/^(\*?)([^:^*]*)$/.test(_sign)) {
      let matched = _sign.match(/^(\*?)(.*)$/);
      let firstMark = matched[1];
      let refValue = matched[2];


      if (firstMark === '*') {

        let splited = refValue.split(/\//);
        let ns = splited.shift();
        let detail = splited.length > 0 ? splited.join('/') : undefined;

        let param = self.getParam(ns);
        if (param === undefined) {
          return '`Error: No Param NS: ' + ns + '`';
        }
        //console.log(detail, param, splited, _refValue);
        ///css/contents-retrieve-by-name/custom?serviceId=56755571b88a6c2ffd90e8e9
        if (detail !== undefined) {
          return ObjectExplorer.getValueByKeyPath(param, detail) || '`Error: No Param ' + detail + ' in ' + ns + '`';
        } else {
          return param;
        }
      }

      return '`Error: Interpret Error`';
    } else if (/^\w+:.*$/.test(_sign)) {
      let matches = _sign.match(/^(\w+):(.*)$/);
      let kind = matches[1];
      let target = matches[2];

      if (kind === 'script') {
        let url = this.contextController.serviceManager.getScriptURLByName(target);

        return url;
      } else if (kind === 'style') {
        let url = this.contextController.serviceManager.getStyleURLByName(target);

        return url;
      } else if (kind === 'image') {
        let url = this.contextController.serviceManager.getImageURLByName(target);

        return url;
      } else if (kind === 'static') {
        let url = this.contextController.serviceManager.getImageStaticByName(target);

        return url;
      }
    }
    return '`Error: Interpret Syntax Error`';
  }



  processingFormularBlock(_blockString) {
    let formularResult;

    try {
      formularResult = eval(_blockString);
    } catch (_e) {
      formularResult = false;
    }

    return formularResult;
  }
}

export default DynamicContext;