import React from 'react';
import './FeedbackLayer.less';

var FeedbackLayer = React.createClass({
  getDefaultProps(){
    return {
      contextController:null
    }
  },

  getInitialState(){
    return {
      hoverElement:null
    }
  },

  calcSummaryPositionStyle(_criteriaLeft, _criteriaTop, _criteriaWidth, _criteriaHeight, _overflowIgnore){
    let style = {};

    if( _criteriaTop < 0 ){
      if( _overflowIgnore ) return null;
    }

    if( _criteriaTop < 20 ){
      // top overflow -> fixed layer top
      style.top = this.boundingRect.top;
    } else  {
      // over criteria top
      style.top = this.boundingRect.top + _criteriaTop - 20;
    }

    if( _criteriaHeight < 50 ){
      // not enougth height -> bottom
      style.top = this.boundingRect.top + _criteriaTop + _criteriaHeight;
    }

    let absLeft,absRight;
    absLeft = _criteriaLeft;
    absRight = this.boundingRect.width - (_criteriaLeft + _criteriaWidth);

    if( absLeft < absRight ){
      // left
      style.left = Math.max(this.boundingRect.left + absLeft,this.boundingRect.left);
    } else {
      let layerAbsRight = window.innerWidth - (this.boundingRect.left + this.boundingRect.width);
      // right
      style.right = Math.max(layerAbsRight + absRight, layerAbsRight);
    }

    return style;
  },

  componentDidMount(){
    this.boundingRect = this.getDOMNode().getBoundingClientRect();
  },

  componentDidUpdate(){
    this.boundingRect = this.getDOMNode().getBoundingClientRect();
  },

  renderSummaryElementType(_type){
    if( _type === 'string' ){
      return <i className='fa fa-font'/>;
    } else if( _type === 'ref') {
      return <i className='fa fa-chain'/>;
    } else if( _type === 'react') {
      return <i className='fa fa-cube'/>;
    } else if( _type === 'html') {
      return <i className='fa fa-sticky-note'/>;
    }
  },

  renderRefSummaryParts(){
    let partElements = [];


    return partElements;
  },

  renderDynamicElementSummary(_elemntNode){
    let detectedInterpret = _elemntNode.detectInterpret();
    if( detectedInterpret === undefined ){
      if( _elemntNode.getType() !== 'ref' ) return;
    }
    
    if( _elemntNode.realization === null ) return;

    let boundingRect = _elemntNode.getBoundingRect();
    let type = _elemntNode.getType();
    let style = this.calcSummaryPositionStyle(boundingRect.left, boundingRect.top, boundingRect.width, boundingRect.height, true);

    if( style === null ) return;

    return (
      <div className='summary' style={style}>
        { this.renderSummaryElementType(type) }
        <span className='type'>{type}</span>
        {type !== 'string' && _elemntNode.getAttribute('id') ? <span className='id'>{_elemntNode.getAttribute('id')}</span>:''}
        {type !== 'string' && _elemntNode.getAttribute('class') ? <span className='class'>{_elemntNode.getAttribute('class')}</span>:''}
        { type === 'ref' ? this.renderRefSummaryParts():''}
      </div>
    );
  },

  renderDynamicElementSummaries(){
    let summaryElements = [];
    let that = this;
    if( this.props.contextController.subject.rootElementNode === null ) return '';
    let rootElementNode = this.props.contextController.subject.rootElementNode;
    if( rootElementNode.realization === null ) return '';

    let dynamicElementSummaryReactElement;
    if( typeof rootElementNode.treeExplore !== 'function' ){
      dynamicElementSummaryReactElement = this.renderDynamicElementSummary(rootElementNode);

      return dynamicElementSummary || '';
    } else {
      rootElementNode.treeExplore(function(_elemntNode){
        dynamicElementSummaryReactElement = that.renderDynamicElementSummary(_elemntNode);

        if( dynamicElementSummaryReactElement === null ) return '';

        summaryElements.push(dynamicElementSummaryReactElement);
      });
    }

    return summaryElements;
  },

  renderHoverUnknownElementGuide(_nodeName){
    let element = this.state.hoverElement;

    let virtualType, boundingRect, rectStyle = {};
    if( _nodeName === '#text' ){
      virtualType = "string";

      let range = document.createRange();
      range.selectNodeContents(element);
      boundingRect = range.getClientRects()[0];
    } else {
      virtualType = "html";
      boundingRect = element.getBoundingClientRect();
    }

    rectStyle.left = boundingRect.left;
    rectStyle.top = boundingRect.top;
    rectStyle.width = boundingRect.width;
    rectStyle.height = boundingRect.height;

    return (
      <div className="hover-guide-rect" style={rectStyle}>
        <div className='summary' style={this.calcSummaryPositionStyle(boundingRect.left, boundingRect.top, boundingRect.width, boundingRect.height)}>
          <i className='fa fa-question'/>
          <span className='type'>Unknown {virtualType}</span>
          {virtualType !== 'string' && element.getAttribute('id') ? <span className='id'>{element.getAttribute('id')}</span>:''}
          {virtualType !== 'string' && element.getAttribute('class') ? <span className='class'>{element.getAttribute('class')}</span>:''}
        </div>
      </div>
    );
  },

  renderHoverElementGuide(){
    let nodeName = this.state.hoverElement.nodeName
    if( nodeName === '#comment' ) return '';
    let elementNode = this.state.hoverElement.___en;

    if( elementNode === undefined ){
      return this.renderHoverUnknownElementGuide(nodeName);
    }

    let type = elementNode.getType();

    let rectStyle = {};


    // tag
    let boundingRect = elementNode.getBoundingRect();

    rectStyle.left = boundingRect.left;
    rectStyle.top = boundingRect.top;
    rectStyle.width = boundingRect.width;
    rectStyle.height = boundingRect.height;

    return(
      <div className="hover-guide-rect" style={rectStyle}>
        <div className='summary' style={this.calcSummaryPositionStyle(boundingRect.left, boundingRect.top, boundingRect.width, boundingRect.height)}>
          {this.renderSummaryElementType(type)}
          <span className='type'>{elementNode.getType()}</span>
          {type !== 'string' && elementNode.getAttribute('id') ? <span className='id'>{elementNode.getAttribute('id')}</span>:''}
          {type !== 'string' && elementNode.getAttribute('class') ? <span className='class'>{elementNode.getAttribute('class')}</span>:''}
        </div>
      </div>);
  },

  render(){
    var style = {};
    style.left = this.props.left;
    style.top = this.props.top;
    style.width = this.props.width;
    style.height = this.props.height;

    return (
      <div className='FeedbackLayer' style={style}>
        { this.state.hoverElement !== null ? this.renderHoverElementGuide():''}
        { this.renderDynamicElementSummaries() }
      </div>
    )
  }
});

export default FeedbackLayer;
