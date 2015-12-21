import './ElementRemoteControl.less';
import GridBox from "../../partComponents/GridBox.jsx";
import React from 'react';

export default React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      defaultLeft:0,
      defaultTop:0
    }
  },

  getInitialState(){
    return {
      left: this.props.defaultLeft,
      top: this.props.defaultTop
    }
  },

  doubleClickTop(){
    this.emit("ReturnMiniOption")
  },

  mouseDownHook(){
    this.dragReady = true;
  },

  mouseUpHook(){
    this.dragReady = false;
  },

  mouseLeaveHook(){
    this.dragReady = false;
  },

  mouseMoveHook(_e){
    if (this.dragReady) {
      app.ui.occupyGlobalDrag(this, true);
      app.ui.enableGlobalDrag();
      app.ui.toMouseDawn();
      app.ui.startGlobalDrag();

      this.setState({'dragging': true, dragX: _e.pageX, dragY:_e.pageY});

      this.dragReady = false;
    }
  },

  onGlobalDragStartFromUI(_e) {
    // var pageX = _e.pageX;
    // var pageY = _e.pageY;
    //
    // this.setState({'dragging': true, dragX: pageX, dragY:pageY});
  },

  onGlobalDragFromUI(_e) {
    var pageX = _e.pageX;
    var pageY = _e.pageY;

    let moveX = pageX - this.state.dragX;
    let moveY = pageY - this.state.dragY;



    this.setState({'dragging': true, dragX: pageX, dragY:pageY, left: this.state.left + moveX, top: this.state.top + moveY });
  },

  onGlobalDragStopFromUI(_e) {


    this.setState({'dragging': false});
  },



  jumpToParent(){
    this.emit("JumpToParent");
  },

  edit(){
    this.emit("Edit");
  },

  clone(){
    this.emit("Clone");
  },

  copyData(){
    this.emit("CopyData");
  },

  pasteIn(){
    this.emit("PasteIn");
  },

  remove(){
    this.emit("Remove");
  },

  returnSelect(){
    this.emit("ReturnSelect");
  },

  render(){
    let style = {
      left: this.state.left,
      top: this.state.top
    };

    return (
      <div className='element-remote-control' style={style}>
        <div className='top' onDoubleClick={this.doubleClickTop} onMouseUp={this.mouseUpHook} onMouseLeave={this.mouseLeaveHook} onMouseDown={this.mouseDownHook} onMouseMove={this.mouseMoveHook}>
          ::::
        </div>
        <div className='body'>
          <GridBox placements={
            [
              [
                <button className='option' onClick={this.jumpToParent}>
                  <i className='fa fa-bolt'/>
                  <span className='title'>Jump to Parent</span>
                </button>,
                <button className='option' onClick={this.edit}>
                  <i className='fa fa-pencil-square-o'/>
                  <span className='title'>Edit</span>
                </button>,
                <button className='option' onClick={this.clone}>
                  <i className='fa fa-clone'/>
                  <span className='title'>Clone</span>
                </button>],[
                <button className='option' onClick={this.copyData}>
                  <i className='fa fa-clipboard'/>
                  <span className='title'>Copy Data</span>
                </button>,
                <button className='option' onClick={this.pasteIn}>
                  <i className='fa fa-pencil-square'/>
                  <span className='title'>Paste In</span>
                </button>,
                <button className='option' onClick={this.remove}>
                  <i className='fa fa-trash'/>
                  <span className='title'>Remove</span>
                </button>]
            ]
          }  width='150' height='80'/>


          <GridBox placements={
            [
              [
                <button className='option' onClick={this.createComponent}>
                  <i className='fa fa-cubes'/>
                  <span className='title'>Create Component</span>
                </button>,
                <button className='option' onClick={this.returnSelect}>
                  <i className='fa fa-times'/>
                  <span className='title'>Return Select</span>
                </button>
              ]
            ]
          }  width='150' height='30'/>

        </div>
      </div>
    )
  }
});
