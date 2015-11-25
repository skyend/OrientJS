import React from 'react';
import GridManager from '../GridManager.jsx';
import './Column.less';

export default React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      activeHandleInsertRowBefore:false,
      activeHandleInsertRowAfter:false
    };
  },

  getDefaultProps(){
    return {
      elementNode:null,
      width:'auto',
      height:'auto',
      minWidth:'auto',
      minHeight:'auto'
    };
  },

  activeHandleInsertRowBefore(){
    this.setState({activeHandleInsertRowBefore:true});
  },

  activeHandleInsertRowAfter(){
    this.setState({activeHandleInsertRowAfter:true});
  },

  inactiveHandleInsertRowBefore(){
    this.setState({activeHandleInsertRowBefore:false});
  },

  inactiveHandleInsertRowAfter(){
    this.setState({activeHandleInsertRowAfter:false});
  },

  appendBeforeNewColumn(){
    this.emit("AppendBeforeNewColumn", {
      targetId: this.props.elementNode.getId()
    });
  },

  appendAfterNewColumn(){
    this.emit("AppendAfterNewColumn", {
      targetId: this.props.elementNode.getId()
    });
  },

  renderOutline(){
    return(
      <div className='outline-container'>
        <div className='outline left activable' onClick={this.appendBeforeNewColumn} onMouseOver={this.activeHandleInsertRowBefore} onMouseOut={this.inactiveHandleInsertRowBefore}/>
        <div className='outline right activable' onClick={this.appendAfterNewColumn} onMouseOver={this.activeHandleInsertRowBefore} onMouseOut={this.inactiveHandleInsertRowBefore}/>
        <div className='outline top'/>
        <div className='outline bottom'/>
      </div>
    );
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
      <div className='behavior behavior-column' style={style}>
        {this.renderOutline()}
      </div>
    )
  }
});
