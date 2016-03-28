import React from 'react';
import _ from 'underscore';
import ScriptCanvas from './ComponentContext/ScriptCanvas.jsx';

require('./ComponentContext.less');

export default React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js'), require("./ContextAdaptor.js")],

  getInitialState(){
    return {
      scriptCanvasFold:false,
      cssCanvasFold:true,
      previewFold:true
    };
  },

  onThrowCatcherUnfold(_e){
    let name = _e.path[0].props.name;

    if( name === 'scriptCanvas' ){
      this.setState({scriptCanvasFold:false})
    } else if( name === 'cssCanvas' ){
      this.setState({cssCanvasFold:false})
    } else if( name === 'preview' ){
      this.setState({previewFold:false})
    }
  },

  onThrowCatcherUnfoldTreeView(_e){
    this.setState({treeViewFold:false});
  },

  onThrowCatcherFold(_e){
    let name = _e.path[0].props.name;

    if( name === 'scriptCanvas' ){
      this.setState({scriptCanvasFold:true})
    } else if( name === 'cssCanvas' ){
      this.setState({cssCanvasFold:true})
    } else if( name === 'preview' ){
      this.setState({previewFold:true})
    }
  },


  renderMainArea(){
    let returnElements = [];


    let fold = 0;
    if( this.state.scriptCanvasFold ){
      fold++;
    }
    if( this.state.cssCanvasFold ){
      fold++;
    }
    if( this.state.previewFold ){
      fold++;
    }

    let divideWidth = (this.props.width-(fold*30)) / (3-fold);

    returnElements.push(<ScriptCanvas  width={this.state.scriptCanvasFold? 30:divideWidth} icon="gg" height={this.props.height} left={divideWidth * 0} name="scriptCanvas" folding={this.state.scriptCanvasFold}/>);
    returnElements.push(<ScriptCanvas  width={this.state.cssCanvasFold? 30:divideWidth} icon="css3" height={this.props.height} left={divideWidth * 1} name="cssCanvas" folding={this.state.cssCanvasFold}/>);
    returnElements.push(<ScriptCanvas  width={this.state.previewFold? 30:divideWidth} icon="rocket" height={this.props.height} left={divideWidth * 2} name="preview" folding={this.state.previewFold}/>);
    return returnElements;
  },


  render(){

    return (
      <div className='ComponentContext' style={this.getRootBaseStyle()}>
        {this.renderMainArea()}
      </div>
    );
  }
});
