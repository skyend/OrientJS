"use strict";
import _ from 'underscore';
import React from 'react';
import ReactTools from 'react-tools';
import less from 'less';

export default class Component {
  constructor(_componentData, _serviceManager) {
    this.serviceManager = _serviceManager;

    this.import(_componentData);
  }


  parseComponentScript(_complete) {
    // 컴포넌트 스크립트 jsx컴파일
    var compiledComponentScript = ReactTools.transform(this.componentScript);

    var executorBody = "\nvar module = { 'exports' : {} }; var exports = module.exports;\n" + compiledComponentScript + ";return module;";

    var scriptExecutor = new Function("React", executorBody);

    let reactComponentObject = scriptExecutor(React).exports;

    _complete(reactComponentObject);
  }

  getConvertedCSS(_complete) {
    less.render(this.componentCSS, function(_err, _output) {
      if (_err === null) {
        _complete(_output.css);
      } else {
        throw new Error("Could not compile to less");
      }
    });
  }

  import (_componentData) {
    let componentData = _componentData || {};
    this.id = componentData._id;
    this.name = componentData.name;
    this.componentScript = componentData.componentScript;
    this.componentCSS = componentData.componentCSS;
    this.propStructList = componentData.propStructList;
  }

  export () {
    return {
      name: this.name,
      componentScript: this.componentScript,
      componentCSS: this.componentCSS,
      propStructList: _.clone(this.propStructList)
    }
  }
}