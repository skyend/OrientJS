(function() {
  var React = require('react');
  var ReactTools = require('react-tools');
  var RequestToServer = require('./util/RequestToServer.js');
  var less = require('less');
  var _ = require('underscore');
  /**
   * ComponentPool
   * @constructor
   */
  function ComponentPool(Session) {
    var self = this;

    this.session = Session;

    this.serviceManager = null;

    this.metaData;
    this.cachedComponent = {}; // 한번로드된 컴포넌트를 캐싱
    this.cachedSupporters = {};
    this.styleCache = {};
  }

  ComponentPool.prototype.updateMeta = function(_url) {
    var metaData = this.session.certifiedRequestJSON(_url, 'get', {
      t: 'api'
    });

    this.metaData = metaData;
  };

  // deprecated
  ComponentPool.prototype.getAvailableComponents = function() {
    return this.metaData['availableComponents'];
  };

  ComponentPool.prototype.getAvailablePackageMeta = function() {
    return this.metaData['availablePackages'];
  };

  ComponentPool.prototype.getAvailableComponentMetaByKey = function(_componentKey, _packageKey) {
    var packagesMeta = this.getAvailablePackageMeta();


    if (_componentKey === undefined) {
      throw new Error("is bad component key");
    }

    var packageMeta = this.getPackageByKey(_packageKey);

    var componentMetaIndex = _.findIndex(packageMeta.components, {
      key: _componentKey
    });

    if (componentMetaIndex != -1) {
      return packageMeta.components[componentMetaIndex];
    } else {

      return this.getAvailableComponentMetaByName(_componentKey, packageMeta.key);
    }
  };

  ComponentPool.prototype.getAvailableComponentMetaByName = function(_componentName, _packageName) {

    if (typeof _componentName === 'undefined') {
      throw new Error("is bad component name");
    }

    var packageMeta = this.getPackageByName(_packageName);

    var componentMetaIndex = _.findIndex(packageMeta.components, {
      name: _componentName
    });

    if (componentMetaIndex != -1) {
      return packageMeta.components[componentMetaIndex];
    } else {

      return undefined;
    }
  };

  ComponentPool.prototype.getPackageByKey = function(_key) {
    var packageList = this.getAvailablePackageMeta();

    var index = _.findIndex(packageList, {
      key: _key
    });

    return packageList[index];
  };

  ComponentPool.prototype.getPackageByName = function(_name) {
    var packageList = this.getAvailablePackageMeta();

    var index = _.findIndex(packageList, {
      name: _name
    });

    return packageList[index];
  };

  ComponentPool.prototype.getComponentFullLocation = function(_componentPath) {
    return this.metaData.host + this.metaData.temporaryNamespaceDir + _componentPath;
  };

  ComponentPool.prototype.getSupporter = function(_supporterTarget) {
    if (this.cachedSupporters[_supporterTarget] === undefined) {
      var componentScript = this.session.certifiedRequest(_supporterTarget, 'get', {
        t: 'api'
      });

      var executorBody;

      executorBody = "\nvar module = { 'exports' : {} }; var exports = module.exports;\n" + componentScript + ";return module;";
      //  console.log(_supporterUrl, executorBody);
      var scriptExecutor = new Function(executorBody);

      var moduleObject = scriptExecutor();

      this.cachedSupporters[_supporterTarget] = moduleObject.exports;
    }

    return this.cachedSupporters[_supporterTarget];
  };


  ComponentPool.prototype.getComponentFromRemote = function(_componentKey, _packageKey, _syncWindowContext, _complete) {


    var self = this;
    var contextWindow = _syncWindowContext || window;
    var componentKey = _componentKey;
    var packageKey = _packageKey;


    if (_packageKey === 'CUSTOM') {
      console.log("Component Pool Custom load");

      console.log(self.serviceManager);
      self.serviceManager.getComponent(_componentKey, function(_result) {
        if (_result.result !== 'success') throw new Error("Load Fail");
        let component = _result.component;
        let componentScript = component.componentScript;
        let componentStyle = component.componentCSS;

        // 컴포넌트 스크립트 jsx컴파일
        var compiledComponentScript = ReactTools.transform(componentScript);

        var executorBody = "\nvar module = { 'exports' : {} }; var exports = module.exports;\n" + compiledComponentScript + ";return module;";

        var scriptExecutor = new contextWindow.Function("session", "React", "using", executorBody);

        let reactComponentObject = scriptExecutor(undefined, React, undefined).exports;

        // CSS 삽입
        reactComponentObject.CSS = componentStyle;

        // 컴포넌트 모듈에 componentName을 지정해둔다.
        reactComponentObject.componentName = componentName;
        reactComponentObject.componentKey = _componentKey;
        reactComponentObject.packageKey = _packageKey;

        _complete(reactComponentObject);
      });

      return;
    }


    if (arguments.length == 1) {
      console.log('인자', arguments);
      var splitedComponentName = componentKey.split('/');
      packageKey = splitedComponentName[0];
      componentKey = splitedComponentName[1];
    }
    console.log('componentKey', componentKey);
    var componentName = packageKey + "/" + componentKey;

    // Component Pool 메타데이터가 있는지 확인한다.
    if (typeof this.metaData === 'undefined') {
      throw new Error('does not update the componentPoolState');
    }
    //console.log('인자', arguments);
    var componentMeta = this.getAvailableComponentMetaByKey(componentKey, packageKey);




    // 제공중인 컴포넌트인지 확인한다.
    if (typeof componentMeta === 'undefined') {
      throw new Error('Component[' + componentName + '] is not provide');
    }


    // 캐시중인 컴포넌트가 있는지 확인한다.
    if (this.cachedComponent[componentName] === undefined || _syncWindowContext !== undefined) {


      var componentScript = this.loadComponentScriptFromRemote(componentMeta);

      // 컴포넌트 스크립트 jsx컴파일
      var compiledComponentScript = ReactTools.transform(componentScript);

      var executorBody;

      executorBody = "\nvar module = { 'exports' : {} }; var exports = module.exports;\n" + compiledComponentScript + ";return module;";


      // 스크립트 실행함수 생성
      // session 과 React 파라메터를 가진다.
      // 모듈내에서 글로벌 하게 사용됨
      var scriptExecutor;


      scriptExecutor = new contextWindow.Function("session", "React", "using", executorBody);

      var moduleObject;
      var test;
      contextWindow.eval(test = window);
      //console.log('window test', test, _syncWindowContext);

      contextWindow.eval(moduleObject = scriptExecutor({
          getComponent: function(__componentName) {
            var recursionLoadedComponent = self.getComponentFromRemote(__componentName);

            self.addCSS(componentName, recursionLoadedComponent.CSS);

            return recursionLoadedComponent;
          },
          getSupporter: function(__supporterKey) {
            return self.getSupporter(__supporterKey);
          }
        }, React,
        function(_usingType) {
          // type 이 확장자가 되어 추가데이터를 로딩한다.

          // using 데이터 위치를 구한다.
          var usingDataLocation = self.getComponentFullLocation(componentMeta.path).replace(/\.[^\.]*?$/, '.' + _usingType);

          // using 데이터 로드
          var usingData = RequestToServer.sync(usingDataLocation, 'get');

          switch (_usingType) {
            case "less":
              less.render(usingData, function(_e, _output) {
                if (_e === null) {
                  self.addCSS(componentName, _output.css);
                } else {
                  throw new Error("Could not compile to less");
                }
              });
              break;
            case "css":
              self.addCSS(componentName, usingData);
              break;
          }

        }));


      this.cachedComponent[componentName] = moduleObject.exports;
    }

    // CSS 삽입
    this.cachedComponent[componentName].CSS = this.getCSS(componentName);

    // 컴포넌트 모듈에 componentName을 지정해둔다.
    this.cachedComponent[componentName].componentName = componentName;
    this.cachedComponent[componentName].componentKey = componentKey;
    this.cachedComponent[componentName].packageKey = packageKey;

    if (typeof _complete === 'function') {
      _complete(this.cachedComponent[componentName]);
    }
    return this.cachedComponent[componentName];
  };


  ComponentPool.prototype.loadComponentScriptFromRemote = function(_componentMeta) {

    // 해당 컴포넌트의 위치데이터를 가져온다
    var componentPath = _componentMeta.path;

    // 컴포넌트가 등록되어 있지 않았을 경우.
    if (typeof componentPath === 'undefined' || componentPath === '') {
      throw new Error("not found available a component in state list. you must buy the component[" + _componentName + "]");
    }

    // 완전한 위치를 구한다.
    var fullLocation = this.getComponentFullLocation(componentPath);

    // 컴포넌트 스크립트 로드
    var componentScript = RequestToServer.sync(fullLocation, 'get');

    return componentScript;
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