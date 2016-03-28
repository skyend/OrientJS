/**
 * PanelTools.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

import './DocumentCSSEditor.less';

import React from "react";
import HorizonField from '../partComponents/HorizonField.jsx';
import _ from 'underscore';

var DocumentCSSEditor = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js'),
    require('./mixins/WidthRuler.js')],

  getDefaultProps(){
    return {
      contextController:null
    };
  },


  onThrowCatcherChangedValue(_eventData, _pass){

    this.props.contextController.modifyDocumentCSS(_eventData.data);
  },

  render() {
    var rootClasses = ['DocumentCSSEditor', this.props.theme, this.getMySizeClass()];

    if( this.props.contextController === null ) return <div className='DocumentCSSEditor error' ><span>Not Found ContextController</span></div>;

    var targetDocument = this.props.contextController.subject;

    if (targetDocument === null) return <div className='DocumentCSSEditor error' ><span>No focused a Document</span></div>;

    return (
      <div className={rootClasses.join(' ')}>
        <HorizonField fieldName='css' title='Document Stylesheet' theme="dark" enterable={true} type={'ace'}
                      ref={'css-field'} onChange={ this.onChange }
                      defaultValue={targetDocument.getPageCSS()} height='100%' lang='css'
                      editorId='document-css-editor'
                      nameWidth={0}/>
      </div>
    );
  }
});

export default DocumentCSSEditor;
