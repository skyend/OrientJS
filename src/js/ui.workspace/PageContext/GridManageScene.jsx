import React from 'react';
import './GridManageScene.less';

let GridManageScene = React.createClass({
  mixins:[require('../reactMixin/EventDistributor.js')],

  createRootGrid(){
    this.emit("CreateRootGrid");
  },

  renderMainArea(){
    return (
      <div className='grid-placeholder'>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={this.props.width} height={this.props.height} >
          <desc>Created with Raphaël</desc>
          <defs></defs>
          <path fill="none" stroke="#423F36" d={"M0,0L"+this.props.width+","+this.props.height} stroke-width="5"></path>
          <path fill="none" stroke="#423F36" d={"M"+this.props.width+",0L0,"+this.props.height} stroke-width="5"></path>
        </svg>

        <button onClick={this.createRootGrid}>Create Root Grid</button>
      </div>
    );
  },

  render(){
    let style = {
      width: this.props.width,
      height: this.props.height,
      left: this.props.left,
      top: this.props.top
    };

    return (
      <div className='GridManageScene' style={style}>
        {this.renderMainArea()}
      </div>
    );
  }
});

export default GridManageScene;
