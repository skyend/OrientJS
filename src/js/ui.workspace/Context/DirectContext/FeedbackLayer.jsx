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

  renderHoverElementGuide(){
    console.log(this.state.hoverElement);
    let nodeName = this.state.hoverElement.nodeName
    if( nodeName === '#comment' ) return '';
    let elementNode = this.state.hoverElement.___en;
    let type = elementNode.getType();

    let rectStyle = {};


    // tag
    let boundingRect = elementNode.getBoundingRect();

    rectStyle.left = boundingRect.left;
    rectStyle.top = boundingRect.top;
    rectStyle.width = boundingRect.width;
    rectStyle.height = boundingRect.height;

    let typeIcon;

    if( type === 'string' ){
      typeIcon = <i className='fa fa-font'/>;
    } else {
      typeIcon = <i className='fa fa-cube'/>;
    }

    return(
      <div className="hover-guide-rect" style={rectStyle}>
        <div className={'summary pos-out'}>
          {typeIcon}<span className='type'>{elementNode.getType()}</span>
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
      </div>
    )
  }
});

export default FeedbackLayer;
