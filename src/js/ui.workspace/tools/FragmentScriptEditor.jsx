/**
 * PanelTools.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

import './FragmentScriptEditor.less';

import React from "react";
import HorizonField from '../partComponents/HorizonField.jsx';
import _ from 'underscore';

var FragmentScriptEditor = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js'),
    require('./mixins/WidthRuler.js')],

  getDefaultProps(){
    return {
      contextController:null
    };
  },

  onThrowCatcherChangedValue(_eventData, _pass){

    this.props.contextController.modifyDocumentScript(_eventData.data);
  },

  render() {
    var rootClasses = ['FragmentScriptEditor', this.props.theme, this.getMySizeClass()];

    if( this.props.contextController === null ) return <div className='FragmentScriptEditor error' ><span>Not Found ContextController</span></div>;

    var targetDocument = this.props.contextController.subject;

    if (targetDocument === null) return <div className='FragmentScriptEditor error' ><span>No focused a Fragment</span></div>;

    return (
      <div className={rootClasses.join(' ')}>
        <HorizonField fieldName='script' title='Fragment Script' theme="dark" enterable={true} type={'ace'}
                      ref={'js-field'} onChange={ this.onChange }
                      defaultValue={targetDocument.getPageScript()} height='100%' lang='javascript'
                      editorId='fragment-script-editor'
                      nameWidth={0}/>
      </div>
    );
  }
});

export default FragmentScriptEditor;
