import React from 'react';
import './PageContext.less';
import IFrameStage from './partComponents/IFrameStage.jsx';

export default React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      stageWidth:1024,
      stageHeight:768
    };
  },
  //
  // getDefaultProps(){
  //   width:0,
  //   height:0
  // },

  goingToContextStop(){
    if (this.state.showElementNavigator) {
      this.closeElementNavigator();
    }

    this.contextController.pause();
  },

  goingToContextRunning(){
    this.contextController.resume();

    this.emit("ContextFocused", {
      contextType: 'page',
      contextController: this.props.contextController
    });
  },

  getContextType(){
    return this.props.contextType;
  },

  componentDidUpdate(){

    if (this.props.runningState === this.props.contextController.running) return;

    if (this.props.runningState) {
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  componentDidMount(){

    // contextController 연결
    this.contextController = this.props.contextController;

    if (this.props.runningState) {
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  render(){
    var iframeStageWidth = (this.state.stageWidth > this.props.width) ? this.props.width : this.state.stageWidth;
    var iframeStageHeight = (this.state.stageHeight > this.props.height) ? this.props.height : this.state.stageHeight;
    iframeStageWidth -= 10;
    iframeStageHeight -= 10;
    var stageX = ( this.props.width - iframeStageWidth ) / 2;
    var stageY = ( this.props.height - iframeStageHeight ) / 2;

    var style = {
      display: 'none',
      width: this.props.width,
      height: this.props.height
    };

    if (this.props.runningState) {
      style.display = 'block';
    }


    return (
      <div className='PageContext' style={style}>
        <IFrameStage ref='iframe-stage' width={iframeStageWidth} height={iframeStageHeight} left={ stageX }
                     top={ stageY }/>

      </div>
    )
  }
});
