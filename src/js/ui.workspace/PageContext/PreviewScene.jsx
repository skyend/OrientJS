import React from 'react';
import './PreviewScene.less';
import IFrameStage from '../partComponents/IFrameStage.jsx';

let PreviewScene = React.createClass({
  mixins:[require('../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      width:0,
      height:0,
      left:0,
      top:0,
      page:null
    };
  },

  getInitialState(){
    return {
      viewer:null
    };
  },

  setViewer(_viewer){
    _viewer.page = this.props.page;
    _viewer.attach( this.refs['iframe-stage'].getIframeInnerWindow());
    
    this.setState({viewer:_viewer});
  },

  componentDidMount(){
    this.emit("GetViewer");

    console.log('mount');
  },

  render(){
    console.log("Preview Scene Render.... ", this.props, this.state);

    return (
      <div className="PreviewScene">
        <IFrameStage ref='iframe-stage' ref='iframe-stage' width={this.props.width} height={this.props.height} left={ this.props.left } top={ this.props.top } color='aqua' freeContextMenu={true}/>
      </div>
    );
  }
});

export default PreviewScene;
