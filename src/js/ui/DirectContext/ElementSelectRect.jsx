import React from "react";
import './ElementSelectRect.less';

var ElementSelectRect = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      width:0,
      height:0,
      left:0,
      top:0,
      active:false
    };
  },

  calcMovement( _nativeEvent ){

  },

  mouseDownPoint(){
    this.dragReady = true;
  },

  mouseMovePoint(_e, _posInfo ){
    if(this.dragReady){
      app.ui.occupyGlobalDrag(this, true);
      app.ui.enableGlobalDrag();
      app.ui.toMouseDawn();

      this.draggingPos = _posInfo;

      this.dragReady = false;
    }
  },

  mouseUpPoint(){
    this.dragReady = false;
  },

  onGlobalDragStartFromUI(_e) {
    var pageX = _e.pageX;
    var pageY = _e.pageY;
    this.emit("ElementResizingStart", {
      pageX:pageX,
      pageY:pageY,
      pointInfo:this.draggingPos
    });
  },

  onGlobalDragFromUI(_e) {
    var pageX = _e.pageX;
    var pageY = _e.pageY;

    this.emit("ElementResizing", {
      pageX:pageX,
      pageY:pageY,
      pointInfo:this.draggingPos
    });
  },

  onGlobalDragStopFromUI(_e) {
    var pageX = _e.pageX;
    var pageY = _e.pageY;

    this.emit("ElementResizingEnd", {
      pageX:pageX,
      pageY:pageY,
      pointInfo:this.draggingPos
    });
  },
  //
  // dragStartPoint(_e, _posList){
  //   var nativeEvent = _e.nativeEvent;
  //
  //   this.prevDragOffsetX = nativeEvent.offsetX;
  //   this.prevDragOffsetY = nativeEvent.offsetY;
  //
  //   this.emit("ElementResizingStart", {
  //     //pageX:nativeEvent.pageX,
  //     //pageY:nativeEvent.pageX,
  //     pointInfo:_posList
  //   });
  // },
  //
  // dragPoint(_e, _posList){
  //   var nativeEvent = _e.nativeEvent;
  //   var moveX = 0;
  //   var moveY = 0;
  //
  //   for(var i = 0; i < _posList.length; i++ ){
  //     if( _posList[i] === 'left' || _posList[i] === 'right' ){
  //       moveX = nativeEvent.offsetX - this.prevDragOffsetX;
  //     } else if ( _posList[i] === 'top' || _posList[i] === 'bottom'){
  //       moveY = nativeEvent.offsetY - this.prevDragOffsetY;
  //     }
  //   }
  //
  //   this.prevDragOffsetX = nativeEvent.offsetX;
  //   this.prevDragOffsetY = nativeEvent.offsetY;
  //
  //   this.emit("ElementResizing", {
  //     moveX:moveX,
  //     moveY:moveY,
  //     pageX:nativeEvent.pageX,
  //     pageY:nativeEvent.pageX,
  //     pointInfo:_posList
  //   });
  // },
  //
  // dragEndPoint(_e, _posList){
  //   var nativeEvent = _e.nativeEvent;
  //
  //   this.emit("ElementResizingEnd", {
  //     //pageX:nativeEvent.pageX,
  //     //pageY:nativeEvent.pageX,
  //     pointInfo:_posList
  //   });
  // },

  renderPoint( _pos ){
    var self = this;
    var posList = _pos.split('-');

    return (
      <div className={'point ' + _pos}
        onMouseDown={function(_e){self.mouseDownPoint.apply(self, [_e, posList])}}
        onMouseMove={function(_e){self.mouseMovePoint.apply(self, [_e, posList])}}
        onMouseUp={function(_e){self.mouseUpPoint.apply(self, [_e, posList])}}/>
    )
  },

// onDragStart={function(_e){ self.dragStartPoint.apply(self,[_e, posList]) }}
// onDrag={function(_e){ self.dragPoint.apply(self,[_e, posList]) }}
// onDragEnd={function(_e){ self.dragEndPoint.apply(self,[_e, posList ]) }}

  renderEightPoint(){
    var self = this;
    var classes = ['eight-container'];

    if( this.props.resizable){
        classes.push('active');
    }

    return (
      <div className={classes.join(' ')}>
        {this.renderPoint('left')}
        {this.renderPoint('right')}
        {this.renderPoint('top')}
        {this.renderPoint('bottom')}
        {this.renderPoint('left-top')}
        {this.renderPoint('left-bottom')}
        {this.renderPoint('right-top')}
        {this.renderPoint('right-bottom')}
      </div>
    )
  },

  render(){
    var style = {
      width: this.props.width,
      height:this.props.height,
      left:this.props.left,
      top:this.props.top,
      opacity:0
    };

    if( this.props.active ){
      style.opacity = 1;
    }

    return (
      <div className='ElementSelectRect' style={style}>
        {this.renderEightPoint()}
      </div>
    )
  }
});


export default ElementSelectRect;
