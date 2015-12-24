import React from 'react';
import _ from 'underscore';
import Column from './ComponentContext/Column.jsx';
import HorizonField from '../partComponents/HorizonField.jsx';
import IFrameStage from '../partComponents/IFrameStage.jsx';

require('./ComponentContext.less');

export default React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js'), require("./ContextAdaptor.js")],

  getInitialState(){
    return {
      scriptCanvasFold:false,
      cssCanvasFold:true,
      previewFold:false
    };
  },

  onThrowCatcherChangedValue(_e){
    let field = _e.name;
    let value = _e.data;

    if( field === 'script' ){
      this.props.contextController.modifyScript(value);
    } else if (field === 'css' ){
      this.props.contextController.modifyStyle(value);
    }


    if(this.refs['preview-stage'] !== undefined){
      this.refs['preview-stage'].reload();
    }
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

  loadedIFrame(_iframe){
    let that = this;
    this.props.contextController.subject.getConvertedCSS(function(_css){
      that.refs['preview-stage'].addStyle('component-style',_css);
    });

    this.props.contextController.subject.parseComponentScript(function(_script){
      let iframeDoc = that.refs['preview-stage'].getIFrameInnerDoc();

      React.render(React.createElement(_script.class), iframeDoc.body);
    });
  },

  renderPreview(){
    return <IFrameStage width='100%' height='100%' onLoadIFrame={this.loadedIFrame} ref="preview-stage"/>
  },

  renderScriptEditor(){
    return <HorizonField fieldName='script' title='Component Script' theme="dark" enterable={true} type={'ace'}
                  ref={'js-field'} onChange={ this.onChange }
                  defaultValue={this.props.contextController.subject.componentScript} height='100%' lang='javascript'
                  editorId={'js-editor-'+this.props.contextController.subject.id}
                  nameWidth={0}/>
  },

  renderCSSEditor(){
    return <HorizonField fieldName='css' title='Component Stylesheet' theme="dark" enterable={true} type={'ace'}
                  ref={'css-field'} onChange={ this.onChange }
                  defaultValue={this.props.contextController.subject.componentCSS} height='100%' lang='css'
                  editorId={'css-editor-'+this.props.contextController.subject.id}
                  nameWidth={0}/>
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

    returnElements.push(<Column reactElement={this.renderScriptEditor()} width={this.state.scriptCanvasFold? 30:divideWidth} icon="gg" height={this.props.height} left={divideWidth * 0} name="scriptCanvas" folding={this.state.scriptCanvasFold}/>);
    returnElements.push(<Column reactElement={this.renderCSSEditor()} width={this.state.cssCanvasFold? 30:divideWidth} icon="css3" height={this.props.height} left={divideWidth * 1} name="cssCanvas" folding={this.state.cssCanvasFold}/>);
    returnElements.push(<Column reactElement={this.renderPreview()} width={this.state.previewFold? 30:divideWidth} icon="rocket" height={this.props.height} left={divideWidth * 2} name="preview" folding={this.state.previewFold}/>);
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
