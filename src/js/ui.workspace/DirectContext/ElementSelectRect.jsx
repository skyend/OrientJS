import React from "react";
import './ElementSelectRect.less';

var ElementSelectRect = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      dragging: false
    };
  },

  getDefaultProps(){
    return {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      active: false
    };
  },

  calcMovement(_nativeEvent){

  },

  mouseDownPoint(){
    this.dragReady = true;
    console.log('down');
  },

  mouseMovePoint(_e, _horizon, _vertical){
    console.log('move');
    if (this.dragReady) {
      app.ui.occupyGlobalDrag(this, true);
      app.ui.enableGlobalDrag();
      app.ui.toMouseDawn();
      app.ui.startGlobalDrag();

      this.draggingPosHor = _horizon;
      this.draggingPosVer = _vertical;

      this.dragReady = false;
    }
  },

  mouseUpPoint(){
    console.log('up');
    this.dragReady = false;
  },

  mouseLeavePoint(){
    console.log('leave');
    this.dragReady = false;
  },

  onGlobalDragStartFromUI(_e) {
    // var pageX = _e.pageX;
    // var pageY = _e.pageY;
    // this.emit("ElementResizingStart", {
    //   pageX:pageX,
    //   pageY:pageY,
    //   pointInfo:this.draggingPos
    // });

    this.setState({'dragging': true});
    this.emit("ElementResizingStart");
  },

  onGlobalDragFromUI(_e) {
    var pageX = _e.pageX;
    var pageY = _e.pageY;

    this.emit("ElementResizing", {
      pageX: pageX,
      pageY: pageY,
      pointHor: this.draggingPosHor,
      pointVer: this.draggingPosVer
    });
  },

  onGlobalDragStopFromUI(_e) {
    var pageX = _e.pageX;
    var pageY = _e.pageY;

    this.emit("ElementResizingEnd", {
      pageX: pageX,
      pageY: pageY,
      pointInfo: this.draggingPos
    });

    this.setState({'dragging': false});
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

  renderPoint(_horizon, _vertical){
    var self = this;

    var twice = true;

    if (_horizon === undefined) twice = !twice;
    if (_vertical === undefined) twice = !twice;

    return (
      <div className={'point ' + (twice ? [_horizon, _vertical].join('-'):[_horizon, _vertical].join(''))}
           onMouseDown={function(_e){self.mouseDownPoint.apply(self, [_e, _horizon, _vertical])}}
           onMouseMove={function(_e){self.mouseMovePoint.apply(self, [_e, _horizon, _vertical])}}
           onMouseLeave={function(_e){self.mouseLeavePoint.apply(self, [_e, _horizon, _vertical])}}
           onMouseUp={function(_e){self.mouseUpPoint.apply(self, [_e, _horizon, _vertical])}}/>
    )
  },

// onDragStart={function(_e){ self.dragStartPoint.apply(self,[_e, posList]) }}
// onDrag={function(_e){ self.dragPoint.apply(self,[_e, posList]) }}
// onDragEnd={function(_e){ self.dragEndPoint.apply(self,[_e, posList ]) }}
  renderUnitControl(){
    if (!this.props.resizable) {
      return '';
    }

    return (
      <div className='unit-setting'>
        <ul>
          <li><i className="fa fa-eraser"></i></li>
          <li>EM</li>
          <li>%</li>
          <li className='selected'>PX</li>
        </ul>
      </div>
    )
  },

  renderEightPoint(){
    var self = this;
    var classes = ['eight-container'];

    if(this.props.editModeHighlight){
      return;
    }

    if (this.props.resizable) {
      classes.push('active');
    }

    return (
      <div className={classes.join(' ')}>
        {this.renderPoint('left', undefined)}
        {this.renderPoint('right', undefined)}
        {this.renderPoint(undefined, 'top')}
        {this.renderPoint(undefined, 'bottom')}
        {this.renderPoint('left', 'top')}
        {this.renderPoint('left', 'bottom')}
        {this.renderPoint('right', 'top')}
        {this.renderPoint('right', 'bottom')}
      </div>
    )
  },

  render(){
    var classes = ['ElementSelectRect'];
    if (this.state.dragging) {
      classes.push('no-animate');
    }

    if( this.props.editModeHighlight ){
      classes.push('edit-mode');
    }

    var style = {
      width: this.props.width,
      height: this.props.height,
      left: this.props.left,
      top: this.props.top,
      opacity: 0
    };

    if (this.props.active) {
      style.opacity = 1;
    }

    return (
      <div className={classes.join(' ')} style={style}>
        {this.renderUnitControl()}
        {this.renderEightPoint()}
      </div>
    )
  }
});


export default ElementSelectRect;
