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

  getInitialState(){
    return {
      document: null
    }
  },

  onThrowCatcherChangedValue(_eventData, _pass){
    this.state.document.setPageCSS(_eventData.data);

  },

  renderEditor(){
    var targetDocument = this.state.document;

    return <DocumentFieldSets targetDocument={targetDocument} ref={targetDocument.getDocumentName()}/>;
  },

  render() {
    var rootClasses = ['DocumentCSSEditor', this.props.theme, this.getMySizeClass()];

    var targetDocument = this.state.document;

    if (targetDocument === null) return <div>No focused a Document</div>;

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
