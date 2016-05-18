"use strict";
import _ from 'underscore';
import ContextController from './ContextController.js';
import Component from './Component.js';

export default class ComponentContextController extends ContextController {
  constructor(_componentData, _serviceManager) {
    super(_componentData, _serviceManager);
    ContextController.call(this, _componentData, _serviceManager);

    this.serviceManager = _serviceManager;

    this.subject = new Component(_componentData);
  }

  save() {
    var self = this;
    var componentJSON = this.subject.export();
    console.log(this.serviceManager);
    this.serviceManager.saveComponent(this.subject.id, componentJSON, function(_result) {
      self.unsaved = false;
      self.context.feedSaveStateChange();
    });
  }

  modifyScript(_value) {
    this.subject.componentScript = _value;
    this.changedContent();
  }

  modifyStyle(_value) {
    this.subject.componentCSS = _value;
    this.changedContent();
  }
}