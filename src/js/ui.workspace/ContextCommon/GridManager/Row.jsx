import React from 'react';
import GridManager from '../GridManager.jsx';
import './Row.less';

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

  appendColumn(){
    console.log("?", this.props.elementNode);

    this.emit("AppendNewColumn", {
      targetId: this.props.elementNode.getId()
    });
  },

  renderColumns(){
    return this.props.elementNode.children.map(function(_column){
      return <GridManager gridElementNode={_column}/>
    });
  },

  renderColumnHolder(){
    console.log( this.props.elementNode.children );

    return (
      <div className='column-holder'>
        <button onClick={this.appendColumn}>
          Add First Column
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
      <div className='behavior behavior-row' style={style}>
        { this.props.elementNode.children.length > 0 ? this.renderColumns():this.renderColumnHolder() }
      </div>
    )
  }
});
