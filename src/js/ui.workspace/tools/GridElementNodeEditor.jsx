/**
 * PanelTools.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

import './GridElementNodeEditor.less';

let React = require("react");
let HorizonFieldSet = require('../partComponents/HorizonFieldSet.jsx');
let _ = require('underscore');

var GridElementNodeEditor = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js'),
    require('./mixins/WidthRuler.js')],

  getDefaultProps(){
    return {
      gridElementNode: null,
      contextController: null
    };
  },

  onThrowCatcherChangedValue(_eventData){
    let targetId = this.props.gridElementNode.getId();
    let fieldName = _eventData.name;
    let data = _eventData.data;


    if( fieldName === 'name' ){
      this.props.contextController.modifyGridProperty(targetId, 'name', data);
    } else {

      this.props.contextController.modifyGridRect(targetId,{
        width: fieldName === 'width' ? data : this.refs['sizing'].getFieldValue('width'),
        minWidth: fieldName === 'min-width' ? data : this.refs['sizing'].getFieldValue('min-width'),
        maxWidth: fieldName === 'max-width' ? data : this.refs['sizing'].getFieldValue('max-width'),
        height: fieldName === 'height' ? data : this.refs['sizing'].getFieldValue('height'),
        minHeight: fieldName === 'min-height' ? data : this.refs['sizing'].getFieldValue('min-height'),
        maxHeight: fieldName === 'max-height' ? data : this.refs['sizing'].getFieldValue('max-height')
      });
    }
  },

  renderInfoFields(_gridElementNode){



    let fieldSet = [];
    fieldSet.push({
      "name": "name",
      title: "Name",
      "initialValue": _gridElementNode.getName(),
      type: "input",
      "enterable": true
    });

    return (
      <HorizonFieldSet title="Info" theme={ "dark" } nameWidth={130} fields={ fieldSet } ref='sizing'/>
    )
  },

  renderSizingFields(_gridElementNode){


    let elementRect = _gridElementNode.getCurrentRectangle();

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

  renderPositioningFields(_gridElementNode){


    let elementRect = _gridElementNode.getCurrentRectangle();

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

  renderRenderingFields(_gridElementNode){
    let elementRect = _gridElementNode.getCurrentRectangle();

    let fieldSet = [];
    fieldSet.push({
      "name": "zIndex",
      title: "Order",
      "initialValue": _gridElementNode.zIndex,
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
    let gridElementNode = this.props.gridElementNode;

    if( gridElementNode === null || gridElementNode === undefined ) return "No selected gridElementNode";
    let type = gridElementNode.getType();
    if( type === 'string' ) return "not available";
    return [
      this.renderInfoFields(gridElementNode),
      this.renderSizingFields(gridElementNode),
      this.renderPositioningFields(gridElementNode),
      this.renderRenderingFields(gridElementNode)
    ];
  },

  render() {
    var rootClasses = ['GridElementNodeEditor', this.getMySizeClass()];

    return (
      <div className={rootClasses.join(' ')}>
        <div className='wrapper'>
          { this.renderParts()}
        </div>
      </div>
    );
  }
});

export default GridElementNodeEditor;