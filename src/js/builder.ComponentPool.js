(function() {
  var React = require('react');
  var ReactTools = require('react-tools');
  var RequestToServer = require('./util/RequestToServer.js');
  var less = require('less');

  /**
   * ComponentPool
   * @constructor
   */
  function ComponentPool(Session) {
    var self = this;

    this.session = Session;

    this.poolStateObject;
    this.cachedComponent = {}; // 한번로드된 컴포넌트를 캐싱
    this.styleCache = {};
  }

  ComponentPool.prototype.updatePoolState = function(_url) {
    var poolStateData = RequestToServer.sync(_url, 'get', {
      t: 'api'
    });


    try {
      this.poolStateObject = JSON.parse(poolStateData);
    } catch (e) {
      throw new Error("ComponentPoolStateSheet parsing error : invalid json syntax");
    }
  };

  ComponentPool.prototype.getComponentFromRemote = function(_componentClassName) {
    var self = this;

    // 임시 버전지정 commonjs 방식
    var version = 2;


    if (typeof this.poolStateObject === 'undefined') {
      throw new Error('does not update the componentPoolState');
    }

    if (typeof this.cachedComponent[_componentClassName] === 'undefined') {
      console.log('load Component', _componentClassName);

      // 해당 컴포넌트의 위치데이터를 가져온다
      var componentLocation = this.poolStateObject.availableComponentsLocation[_componentClassName];

      // 컴포넌트가 등록되어 있지 않았을 경우.
      if (typeof componentLocation === 'undefined' || componentLocation === '') {
        throw new Error("not found available a component in state list. you must buy the component[" + _componentClassName + "]");
      }

      // 완전한 위치를 구한다.
      var fullLocation = this.poolStateObject.host + this.poolStateObject.temporaryNamespaceDir + componentLocation;

      // 컴포넌트 스크립트 로드
      var componentScript = RequestToServer.sync(fullLocation, 'get');

      // 컴포넌트 스크립트 jsx컴파일
      var compiledComponentScript = ReactTools.transform(componentScript);

      var executorBody;

      if (version == 1) {
        //executorBody = "\nvar exports;\n" + compiledComponentScript + ";return exports;";
        console.error('deprecated');
      } else if (version == 2) {
        executorBody = "\nvar module = { 'exports' : {} }; var exports = module.exports;\n" + compiledComponentScript + ";return module;";
      }

      // 스크립트 실행함수 생성
      // session 과 React 파라메터를 가진다.
      // 모듈내에서 글로벌 하게 사용됨
      var scriptExecutor = new Function("session", "React", "using", executorBody);

      // 스크립트를 실행하여 Component ReactClass 를 얻는다.
      if (version == 1) {
        // requirejs 모듈 전송방식 + exports 전송 방식 혼합
        // this.cachedComponent[_componentClassName] = scriptExecutor()(this.session, React);
        console.error('deprecated');
      } else if (version == 2) {
        // Common JS 모듈 전송 방식


        var moduleObject = scriptExecutor({
            getComponent: function(_componentName) {
              var recursionLoadedComponent = self.session.componentPool.getComponentFromRemote(_componentName);

              self.addCSS(_componentClassName, recursionLoadedComponent.CSS);

              return recursionLoadedComponent;
            }
          }, React,
          function(_usingType) {
            // type 이 확장자가 되어 추가데이터를 로딩한다.

            // using 데이터 위치를 구한다.
            var usingDataLocation = fullLocation.replace(/\.[^\.]*?$/, '.' + _usingType);

            // using 데이터 로드
            var usingData = RequestToServer.sync(usingDataLocation, 'get');

            if (_usingType === 'less') {

              less.render(usingData, function(_e, _output) {
                //if (_e !== null && typeof _e !== 'undefined') {

                self.addCSS(_componentClassName, _output.css);
                //}
              });
            } else {

            }

          });


        /*
        if (typeof moduleObject.exports === 'function') {
          this.cachedComponent[_componentClassName] = moduleObject.exports;
        } else {
          this.cachedComponent[_componentClassName] = moduleObject.exports;
        }*/

        this.cachedComponent[_componentClassName] = moduleObject.exports;

      }

    }

    // CSS 삽입
    this.cachedComponent[_componentClassName].CSS = this.getCSS(_componentClassName);
    return this.cachedComponent[_componentClassName];
  };

  ComponentPool.prototype.addCSS = function(_componentName, _css) {
    if (typeof this.styleCache[_componentName] === 'undefined') {
      this.styleCache[_componentName] = '';
    }

    this.styleCache[_componentName] += _css;
  };

  ComponentPool.prototype.getCSS = function(_componentName) {
    return this.styleCache[_componentName];
  };

  module.exports = ComponentPool;
})();