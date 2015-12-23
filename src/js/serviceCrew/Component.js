"use strict";
import _ from 'underscore';

export default class Component {
  constructor(_componentData, _serviceManager) {
    this.serviceManager = _serviceManager;

    this.import(_componentData);
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