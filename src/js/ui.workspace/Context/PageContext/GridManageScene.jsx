import React from 'react';
import './GridManageScene.less';
import GridManager from '../ContextCommon/GridManager.jsx';

let GridManageScene = React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      rootGridElement: null
    };
  },

  getInitialState(){
    return {
      placeholderDisappear: false
    };
  },

  createRootGrid(){
    let self = this;

    this.setState({placeholderDisappear:true});

    setTimeout(function(){
      self.emit("CreateRootGrid");
      self.setState({placeholderDisappear:false});
    }, 500);
  },



  renderAreaPlaceholder(){
    let buttonStyle = {};
    let svgStyle = {};
    if( this.state.placeholderDisappear ){
      svgStyle.opacity = 0;

      buttonStyle.width = this.props.width;
      buttonStyle.height = this.props.height;
      buttonStyle.left = buttonStyle.top = 0;
      buttonStyle.margin = 0;
      buttonStyle.backgroundColor = 'transparent';
      buttonStyle.color = 'transparent';
      buttonStyle.pointerEvents = 'none';
    }

    return (
      <div className='grid-placeholder' >
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={this.props.width} height={this.props.height} style={svgStyle} >
          <desc>Created with Raphaël</desc>
          <defs></defs>
          <path fill="none" stroke="#423F36" d={"M0,0L"+this.props.width+","+this.props.height} strokeWidth="5"></path>
          <path fill="none" stroke="#423F36" d={"M"+this.props.width+",0L0,"+this.props.height} strokeWidth="5"></path>
        </svg>

        <button style={buttonStyle} onClick={this.createRootGrid}>Create Root Grid</button>
      </div>
    );
  },

  renderMainArea(){
    if( this.props.rootGridElement === null ){
      return this.renderAreaPlaceholder();
    }

    console.log(this.props.rootGridElement.calcRequiredContainerSize());

    return (
      <GridManager gridElementNode={this.props.rootGridElement} width={this.props.width} height={this.props.height} left={0} top={0}/>
    )
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
