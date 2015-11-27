import React from 'react';
import GridManager from '../GridManager.jsx';
import './Layer.less';

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

  getInitialState(){
    return {
      activeHandleInsertRowBefore:false,
      activeHandleInsertRowAfter:false,
      fragmentObject:null
    };
  },

  setFragmentId(_fragmentId){
    this.emit("AttachFragment", {
      targetId: this.props.elementNode.getId(),
      fragmentId: _fragmentId
    });
  },

  attachFragment(){
    var self = this;

    this.emit("RequestAttachTool", {
      "toolKey": "FragmentSelector",
      "where": "ModalWindow",
      "params": {
        "input-data-callback": function (_d) {
          self.setFragmentId(_d);
        }
      }
    });
  },

  addGrid(){
    this.emit("SetNewGrid", {
      targetId: this.props.elementNode.getId()
    });
  },

  addLayer(){
    this.emit("AppendNewLayer", {
      targetId: this.props.elementNode.getId()
    });
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

  requestFragmentObject(_fragmentId){
    this.emit("NeedDocument", {
      documentId:_fragmentId
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

  renderChildren(){
    let columnCount = this.props.elementNode.children.length;

    let leftSpace = 2;
    let rightSpace = 2;
    let topSpace = 2;
    let bottomSpace = 2;

    if( this.state.activeHandleInsertRowBefore ) leftSpace = 10;
    else if (this.state.activeHandleInsertRowAfter) rightSpace = 10;

    let assignedWidth = this.props.width-(leftSpace+rightSpace);
    let assignedHeight = this.props.height-(topSpace+bottomSpace);

    if( columnCount == 1 ){
      return <GridManager gridElementNode={this.props.elementNode.children[0]} left={leftSpace} top={topSpace} width={assignedWidth} height={assignedHeight}/>
    }


    return this.props.elementNode.children.map(function(_gridElement, _i){
      return <GridManager gridElementNode={_gridElement} left={leftSpace} top={topSpace} width={divideWidth} height={divideHeight}/>
    });
  },

  renderCore(){
    let hasFragment = false;
    if( this.props.elementNode.followingFragment !== null ){
      hasFragment = true;
    }

    let renders = [];

    if( this.props.elementNode.children.length == 0 && !hasFragment ){
      renders.push(this.renderEmptyHolder())
    } else {
      if( hasFragment ){
        renders.push(this.renderFragment());
      }

      if( this.props.elementNode.children.length > 0 ){
        renders.push(this.renderChildren());
      }
    }

    return renders;
  },

  renderEmptyHolder(){
    return (
      <div className='holder'>
        <div className='button-wrapper'>
          <button onClick={this.attachFragment}>Attach Fragment</button>
          <button onClick={this.addGrid}>Add Grid</button>
          <button onClick={this.addLayer}>Add Layer</button>
        </div>
      </div>
    )
  },

  renderFragment(){
    let svgStyle = {};
    let fragmentTitle = undefined;

    // fragmentObject 가 null이면
    if( this.state.fragmentObject === null ){
      this.requestFragmentObject(this.props.elementNode.followingFragment);
    } else {

      //fragmentObject 가 null 아닌데 _id가 매치되지 않는경우 Fragment가 변경된 경우로 다시 요청한다.
      if( this.state.fragmentObject._id !== this.props.elementNode.followingFragment ){
        this.requestFragmentObject(this.props.elementNode.followingFragment);
      } else {
        fragmentTitle = this.state.fragmentObject.title;
      }
    }

    return (
      <div className='fragment'>
        <div className='fragment-info'>
          <div className='title'>
            {fragmentTitle || this.props.elementNode.followingFragment}
          </div>
        </div>
      </div>);
  },

// <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={this.props.width} height={this.props.height} style={svgStyle} >
//   <desc>Created with Raphaël</desc>
//   <defs></defs>
//   <path fill="none" stroke="#423F36" d={"M0,0L"+this.props.width+","+this.props.height} strokeWidth="5"></path>
//   <path fill="none" stroke="#423F36" d={"M"+this.props.width+",0L0,"+this.props.height} strokeWidth="5"></path>
// </svg>

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
      <div className='behavior behavior-layer' style={style}>
        {this.renderOutline()}
        {this.renderCore()}
      </div>
    )
  }
});
