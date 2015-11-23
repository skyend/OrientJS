import React from 'react';
import GridManager from '../GridManager.jsx';
import './Grid.less';

export default React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      elementNode:null,
      width:'auto',
      height:'auto',
      minWidth:'auto',
      minHeight:'auto'
    };
  },

  addRow(){

  },

  renderRowHolder(){
    console.log( this.props.elementNode.children );

    return (
      <div className='row-holder'>
        <button click={this.addRow}>
          Add First Row
        </button>
      </div>
    )
  },

  render(){
    let style = {
      width:this.props.width,
      height:this.props.height,
      minWidth:this.props.minWidth,
      minHeight:this.props.minHeight,
      left:this.props.left,
      top:this.props.top
    };

    return (
      <div className='behavior behavior-grid' style={style}>
        { this.props.elementNode.children.length > 0 ? this.renderRows():this.renderRowHolder() }
      </div>
    )
  }
});
