/**
 * PanelTools.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

import './GridElementNodeEditor.less';

import React from "react";
import HorizonFieldSet from '../partComponents/HorizonFieldSet.jsx';
import _ from 'underscore';

var GridElementNodeEditor = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js'),
    require('./mixins/WidthRuler.js')],

  getDefaultProps(){
    return {

    };
  },

  getInitialState(){
    return {
      gridElementNode: null,
      contextController: null
    };
  },

  onThrowCatcherChangedValue(_eventData){
    let targetId = this.state.gridElementNode.getId();
    let fieldName = _eventData.name;
    let data = _eventData.data;

    if( fieldName === 'width' ){
      let height = this.refs['sizing'].getFieldValue('height');

      this.state.contextController.modifyGridRect(targetId,{
        width: data,
        height: height
      });
    } else if( fieldName === 'height' ){
      let width = this.refs['sizing'].getFieldValue('width');

      this.state.contextController.modifyGridRect(targetId, {
        width: width,
        height: data
      });
    } else if( fieldName === 'name' ){
      this.state.contextController.modifyGridProperty(targetId, 'name', data);
    }
  },

  renderInfoFields(){
    let gridElementNode = this.state.gridElementNode;

    if( gridElementNode === null ) return "No selected gridElementNode";

    let fieldSet = [];
    fieldSet.push({
      "name": "name",
      title: "Name",
      "initialValue": gridElementNode.getName(),
      type: "input",
      "enterable": true
    });

    return (
      <HorizonFieldSet title="Info" theme={ "dark" } nameWidth={130} fields={ fieldSet } ref='sizing'/>
    )
  },

  renderSizingFields(){
    let gridElementNode = this.state.gridElementNode;

    if( gridElementNode === null ) return "No selected gridElementNode";
    let elementRect = gridElementNode.getCurrentRectangle();

    let fieldSet = [];
    fieldSet.push({
      "name": "width",
      title: "Width",
      "initialValue": elementRect.width,
      type: "input",
      "enterable": true
    });

    fieldSet.push({
      "name": "height",
      title: "Height",
      "initialValue": elementRect.height,
      type: "input",
      "enterable": true
    });

    return (
      <HorizonFieldSet title="Grid Sizing" theme={ "dark" } nameWidth={130} fields={ fieldSet } ref='sizing'/>
    )
  },

  renderPositioningFields(){
    let gridElementNode = this.state.gridElementNode;

    if( gridElementNode === null ) return "No selected gridElementNode";
    let elementRect = gridElementNode.getCurrentRectangle();

    let fieldSet = [];
    fieldSet.push({
      "name": "width",
      title: "Width",
      "initialValue": elementRect.width,
      type: "input",
      "enterable": true
    });

    fieldSet.push({
      "name": "height",
      title: "Height",
      "initialValue": elementRect.height,
      type: "input",
      "enterable": true
    });

    return (
      <HorizonFieldSet title="Grid Positioning" theme={ "dark" } nameWidth={130} fields={ fieldSet } ref='positioning'/>
    )
  },

  render() {
    var rootClasses = ['GridElementNodeEditor', this.getMySizeClass()];

    return (
      <div className={rootClasses.join(' ')}>
        <div className='wrapper'>
          { this.renderInfoFields()}
          { this.renderSizingFields()}
          { this.renderPositioningFields()}
        </div>
      </div>
    );
  }
});

export default GridElementNodeEditor;
