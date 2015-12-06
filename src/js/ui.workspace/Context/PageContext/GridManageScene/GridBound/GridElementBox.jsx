import React from 'react';
import './GridElementBox.less';
import OutlineButton from '../../../../partComponents/OutlineButton.jsx';

let GridElementBox = React.createClass({
  mixins:[require('../../../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      gridElement:null,
      selectedGridElement:null,
      screenMode:'desktop',
      multiplier:1
    };
  },

  getInitialState(){
    return {
      fragmentObject:null
    }
  },

  appendRow(){

    this.emit("AppendNewRow", {
      targetId: this.props.gridElement.getId()
    });
  },

  appendColumn(){
    console.log("?", this.props.gridElement);

    this.emit("AppendNewColumn", {
      targetId: this.props.gridElement.getId()
    });
  },

  setFragmentId(_fragmentId){
    this.emit("AttachFragment", {
      targetId: this.props.gridElement.getId(),
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

  setFragmentId(_fragmentId){
    this.emit("AttachFragment", {
      targetId: this.props.gridElement.getId(),
      fragmentId: _fragmentId
    });
  },

  addGrid(){
    this.emit("SetNewGrid", {
      targetId: this.props.gridElement.getId()
    });
  },

  addLayer(){
    this.emit("AppendNewLayer", {
      targetId: this.props.gridElement.getId()
    });
  },

  requestFragmentObject(_fragmentId){
    this.emit("NeedDocument", {
      documentId:_fragmentId
    });
  },

  click(_e){
    console.log('click', _e.target);
    _e.stopPropagation();

    this.emit("SelectGridElementNode", {
      gridElementNode: this.props.gridElement
    });
  },

  hover(_e){
    _e.stopPropagation();
  },

  renderFragment(){
    let svgStyle = {};
    let fragmentTitle = undefined;
    let fragmentStyle = {};
    let leftSpace = 2;
    let rightSpace = 2;
    let topSpace = 2;
    let bottomSpace = 2;

    if( this.state.activeHandleInsertRowBefore ) leftSpace = 10;
    else if (this.state.activeHandleInsertRowAfter) rightSpace = 10;

    fragmentStyle.left = leftSpace;
    fragmentStyle.top = topSpace;
    fragmentStyle.width = this.props.width - leftSpace - rightSpace;
    fragmentStyle.height = this.props.height - topSpace - bottomSpace;

    // fragmentObject 가 null이면
    if( this.state.fragmentObject === null ){
      this.requestFragmentObject(this.props.gridElement.followingFragment);
    } else {

      //fragmentObject 가 null 아닌데 _id가 매치되지 않는경우 Fragment가 변경된 경우로 다시 요청한다.
      if( this.state.fragmentObject._id !== this.props.gridElement.followingFragment ){
        this.requestFragmentObject(this.props.gridElement.followingFragment);
      } else {
        fragmentTitle = this.state.fragmentObject.title;
      }
    }

    return (
      <div className='fragment' style={fragmentStyle}>
        <div className='fragment-info'>
          <div className='title'>
            {fragmentTitle || this.props.gridElement.followingFragment}
          </div>
        </div>
      </div>);
  },

  renderChildHolder(){
    let behavior = this.props.gridElement.behavior;

    let childButtons = [];

    if( behavior === 'grid' ){
      childButtons.push(<OutlineButton icon='bars' width="150" title='Create First Row' color='blue' titleSize='14' iconSize='16' onClick={this.appendRow}/>);
    } else if( behavior === 'row' ){
      childButtons.push(<OutlineButton icon='columns' width="170" title='Create First Column' color='blue' titleSize='14' iconSize='16' onClick={this.appendColumn}/>);
    }else if( behavior === 'column' || behavior === 'layer'){
      childButtons.push(<OutlineButton icon='file-text-o' width="170" title='Attach Fragment' color='blue' titleSize='14' iconSize='16' onClick={this.attachFragment}/>);
      childButtons.push(<OutlineButton icon='plane' width="170" title='Create First Layer' color='blue' titleSize='14' iconSize='16' onClick={this.addLayer}/>);
      childButtons.push(<OutlineButton icon='th-large' width="120" title='Create Grid' color='blue' titleSize='14' iconSize='16' onClick={this.addGrid}/>);
    }

    return (
      <div className='child-holder'>
        {childButtons}
      </div>
    );
  },

  renderChildren(){
    if( this.props.gridElement.followingFragment !== null ){
      return this.renderFragment();
    }
    if( this.props.gridElement.children.length == 0 ){
      return this.renderChildHolder();
    }
    let self = this;

    return this.props.gridElement.children.map(function(_child){
      return <GridElementBox gridElement={_child} selectedGridElement={self.props.selectedGridElement} multiplier={self.props.multiplier} screenMode={self.props.screenMode}/>;
    });
  },

  render(){
    let classes = ['GridElementBox', this.props.gridElement.behavior];
    let style = {};
    let rectangle = this.props.gridElement.getRectangleByScreenMode(this.props.screenMode);
    let containerSize = this.props.gridElement.calcContainerSize(this.props.screenMode);

    if( rectangle.width === 'auto' ){
      style.width = this.props.gridElement.analysisFriendAutoPart('width',this.props.screenMode);
    } else {
      if( /^[\d\.]+(px)?$/.test(rectangle.width) ){
        style.width = parseInt(rectangle.width) / this.props.multiplier;
      }

      style.width = rectangle.width;
    }

    if( rectangle.height === 'auto' ){
      style.height = this.props.gridElement.analysisFriendAutoPart('height',this.props.screenMode);
    } else {
      if( /^[\d\.]+(px)?$/.test(rectangle.height) ){
        style.height = parseInt(rectangle.height) / this.props.multiplier;
      }

      style.height = rectangle.height;
    }


    if( this.props.selectedGridElement === this.props.gridElement){
      classes.push("selected");
    }

    return (
      <div className={classes.join(' ')} style={style} onClick={this.click} onMouseOver={this.hover}>
        { this.renderChildren() }
      </div>
    )
  }
});


export default GridElementBox;
