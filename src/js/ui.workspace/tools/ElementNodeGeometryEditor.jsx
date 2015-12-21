/**
 * PanelTools.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

import './ElementNodeGeometryEditor.less';

import React from "react";
import HorizonFieldSet from '../partComponents/HorizonFieldSet.jsx';
import _ from 'underscore';

var ElementNodeGeometryEditor = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js'),
    require('./mixins/WidthRuler.js')],

  getDefaultProps(){
    return {
      screenMode: 'desktop',
      elementNode: null,
      contextController: null
    };
  },

  onThrowCatcherChangedValue(_eventData){
    let targetId = this.props.elementNode.getId();
    let fieldName = _eventData.name;
    let data = _eventData.data;


    this.props.contextController.modifyElementGeometry(targetId, 'rectangle',{
      width: fieldName === 'width' ? data : this.refs['sizing'].getFieldValue('width'),
      minWidth: fieldName === 'min-width' ? data : this.refs['sizing'].getFieldValue('min-width'),
      maxWidth: fieldName === 'max-width' ? data : this.refs['sizing'].getFieldValue('max-width'),
      height: fieldName === 'height' ? data : this.refs['sizing'].getFieldValue('height'),
      minHeight: fieldName === 'min-height' ? data : this.refs['sizing'].getFieldValue('min-height'),
      maxHeight: fieldName === 'max-height' ? data : this.refs['sizing'].getFieldValue('max-height')
    }, this.props.screenMode);
  },

  renderSizingFields(_elementNode){


    let elementRect = _elementNode.getRectangleByScreenMode(this.props.screenMode);
    console.log(elementRect);

    let fieldSet = [];
    fieldSet.push({
      "name": "width",
      title: "Width",
      "initialValue": elementRect.width,
      type: "input",
      "enterable": true
    });
    fieldSet.push({
      "name": "min-width",
      title: "Min Width",
      "initialValue": elementRect.minWidth,
      type: "input",
      "enterable": true
    });
    fieldSet.push({
      "name": "max-width",
      title: "Max Width",
      "initialValue": elementRect.maxWidth,
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
    fieldSet.push({
      "name": "min-height",
      title: "Min Height",
      "initialValue": elementRect.minHeight,
      type: "input",
      "enterable": true
    });
    fieldSet.push({
      "name": "max-height",
      title: "Max Height",
      "initialValue": elementRect.maxHeight,
      type: "input",
      "enterable": true
    });

    return (
      <HorizonFieldSet title="Rectangle Sizing" theme={ "dark" } nameWidth={130} fields={ fieldSet } ref='sizing'/>
    )
  },

  renderPositioningFields(_elementNode){

    let elementRect = _elementNode.getCurrentRectangle();

    let fieldSet = [];
    fieldSet.push({
      "name": "horizontal",
      title: "Horizontal",
      "initialValue": elementRect.width,
      type: "select",
      "options": [
        { value:"left", title:"Left" },
        { value:"center", title:"Center" },
        { value:"Right", title:"right" }
      ],
      "enterable": true
    });

    fieldSet.push({
      "name": "vertical",
      title: "Vertical",
      "initialValue": elementRect.height,
      type: "select",
      "options": [
        { value:"top", title:"Top" },
        { value:"middle", title:"Middle" },
        { value:"bottom", title:"Bottom" }
      ],
      "enterable": true
    });

    fieldSet.push({
      "name": "horizontalOffset",
      title: "horizontalOffset",
      "initialValue": elementRect.height,
      type: "input",
      "enterable": true
    });

    fieldSet.push({
      "name": "verticalOffset",
      title: "VerticalOffset",
      "initialValue": elementRect.height,
      type: "input",
      "enterable": true
    });

    return (
      <HorizonFieldSet title="Rectangle Positioning" theme={ "dark" } nameWidth={130} fields={ fieldSet } ref='positioning'/>
    )
  },

  renderRenderingFields(_elementNode){
    let elementRect = _elementNode.getCurrentRectangle();

    let fieldSet = [];
    fieldSet.push({
      "name": "zIndex",
      title: "Order",
      "initialValue": _elementNode.zIndex,
      type: "input",
      "enterable": true
    });

    fieldSet.push({
      "name": "display",
      title: "Display",
      "initialValue": elementRect.height,
      type: "input",
      "enterable": true
    });

    return (
      <HorizonFieldSet title="Rectangle Rendering" theme={ "dark" } nameWidth={130} fields={ fieldSet } ref='rendering'/>
    )
  },

  renderParts(){
    let elementNode = this.props.elementNode;

    if( elementNode === null || elementNode === undefined ) return "No selected elementNode";
    let type = elementNode.getType();
    if( type === 'string' ) return "not available";
    return [
      this.renderSizingFields(elementNode),
      this.renderPositioningFields(elementNode),
      this.renderRenderingFields(elementNode)
    ];
  },

  render() {
    var rootClasses = ['ElementNodeGeometryEditor', this.getMySizeClass()];
    console.log( this.props);
    return (
      <div className={rootClasses.join(' ')}>
        <div className='wrapper'>
          { this.renderParts()}
        </div>
      </div>
    );
  }
});

export default ElementNodeGeometryEditor;
