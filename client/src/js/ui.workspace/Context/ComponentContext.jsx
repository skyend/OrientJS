import React from 'react';
import _ from 'underscore';
// import Column from './ComponentContext/Column.jsx';
import HorizonField from '../partComponents/HorizonField.jsx';
import IFrameStage from '../partComponents/IFrameStage.jsx';

import AverageColumns from '../partComponents/AverageColumns.jsx';

require('./ComponentContext.less');

export default React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js'), require("./ContextAdaptor.js")],

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
    return <IFrameStage width='100%' height='100%' onLoadIFrame={this.loadedIFrame} ref="preview-stage" freeContextMenu={true}/>
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


  render(){
    let columns = [
      {name:'ScriptCanvas', icon:'gg', defaultFold:false, element:this.renderScriptEditor()},
      {name:'CssCanvas', icon:'css3', defaultFold:true, element:this.renderCSSEditor()},
      {name:'Preview', icon:'rocket', defaultFold:false, element:this.renderPreview()}
    ];


    return (
      <div className='ComponentContext' style={this.getRootBaseStyle()}>
        <AverageColumns  columns={columns} width={ this.props.width} height={this.props.height}/>
      </div>
    );
  }
});
