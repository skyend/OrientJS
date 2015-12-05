import React from 'react';
import './GridManageScene.less';
//import GridManager from '../ContextCommon/GridManager.jsx';
import GridBound from './GridManageScene/GridBound.jsx';

let GridManageScene = React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      rootGridElement: null,
      selectedGridNode: null
    };
  },

  getInitialState(){
    return {
      placeholderDisappear: false,
      desktopGridFold:false,
      tabletGridFold:false,
      mobileGridFold:false
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

  onThrowCatcherUnfold(_e){
    let targetMode = _e.path[0].props.screenMode;

    if( targetMode === 'desktop' ){
      this.setState({desktopGridFold:false})
    } else if( targetMode === 'tablet' ){
      this.setState({tabletGridFold:false})
    } else if( targetMode === 'mobile' ){
      this.setState({mobileGridFold:false})
    }
  },

  onThrowCatcherFold(_e){
    let targetMode = _e.path[0].props.screenMode;

    if( targetMode === 'desktop' ){
      this.setState({desktopGridFold:true})
    } else if( targetMode === 'tablet' ){
      this.setState({tabletGridFold:true})
    } else if( targetMode === 'mobile' ){
      this.setState({mobileGridFold:true})
    }
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
    let returnElements = [];


    let foldGrids = 0;
    if( this.state.desktopGridFold ){
      foldGrids++;
    }
    if( this.state.tabletGridFold ){
      foldGrids++;
    }
    if( this.state.mobileGridFold ){
      foldGrids++;
    }

    let divideWidth = (this.props.width-(foldGrids*30)) / (3-foldGrids);

    returnElements.push(<GridBound width={this.state.desktopGridFold? 30:divideWidth} height={this.props.height} left={0} screenMode="desktop" folding={this.state.desktopGridFold}/>);
    returnElements.push(<GridBound width={this.state.tabletGridFold? 30:divideWidth} height={this.props.height} left={divideWidth} screenMode="tablet" folding={this.state.tabletGridFold}/>);
    returnElements.push(<GridBound width={this.state.mobileGridFold? 30:divideWidth} height={this.props.height} left={divideWidth * 2} screenMode="mobile" folding={this.state.mobileGridFold}/>);

    return returnElements;
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
