/**
 * PanelTools.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

require('./DocumentConfig.less');

var React = require("react");
var HorizonFieldSet = require('../partComponents/HorizonFieldSet.jsx');
var DocumentFieldSets = require('./DocumentConfig/Document.jsx');
var _ = require('underscore');

var DocumentConfig = React.createClass({
    mixins: [require('../reactMixin/EventDistributor.js'),
              require('./mixins/WidthRuler.js')],


    getInitialState(){
      return {
        document:null
      }
    },

    // 변경되는 값에따라 바로바로 ElementNode에 반영하고 랜더링을 진행한다.
    onThrowCatcherChangedValue( _eventData, _pass ){
      var elementNode = this.state.elementNode;
      var changedData = _eventData.data;


      var targetDoc = this.state.document;


      if( _eventData.refPath[1] === 'Style' ){
        if( _eventData.refPath[0] === 'PageCSS' ){
          targetDoc.setPageCSS( changedData );
        }
      } else if ( _eventData.refPath[1] === 'DocumentProfile'){
        if( _eventData.refPath[0] === 'DocumentTitle' ){
          targetDoc.setDocumentTitle(changedData);
        } else if( _eventData.refPath[0] === 'DocumentName' ){
          targetDoc.setDocumentName(changedData);
        }
      }

    },

    renderDocument(){
      var targetDocument = this.state.document;

      return <DocumentFieldSets targetDocument={targetDocument} ref={targetDocument.getDocumentName()}/> ;
    },

    render() {
        var rootClasses = ['DocumentConfig', this.props.config.theme, this.getMySizeClass()];

        var targetDocument = this.state.document;


        return (
            <div className={rootClasses.join(' ')}>
                <div className='wrapper'>
                  <div className='body'>
                    <div className='edit-parts'>
                      { targetDocument !== null ? this.renderDocument():'' }
                    </div>
                  </div>
                  <div className="footer">


                  </div>
                </div>
            </div>
        );
    }
});
module.exports = DocumentConfig;
