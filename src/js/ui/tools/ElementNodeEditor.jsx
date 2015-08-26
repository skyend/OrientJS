
var React = require("react");
require('./ElementNodeEditor.less');

var BasicButton = require('../partComponents/BasicButton.jsx');
var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');
var HorizonField = require('../partComponents/HorizonField.jsx');
var HorizonFieldSet = require('../partComponents/HorizonFieldSet.jsx');
var htmlTag = require('./toolsData/htmlTag.json');
var HTMLDOMSpec = require('./ElementNodeEditor/HTMLDOMSpec.jsx');
var EmptyTypeElementNode = require('./ElementNodeEditor/EmptyTypeElementNode.jsx');

var ElementNodeEditor = React.createClass({
    mixins: [
        require('../reactMixin/EventDistributor.js'),
        require('./mixins/WidthRuler.js')],

    getInitialState(){
        return {
          elementNode:null
        };
    },

    onClickReset(){
      this.refs['profile-set'].resetAll();
      this.refs['spec-set'].resetAll();
      this.refs['tag-attrs-set'].resetAll();
    },

    onClickApply(){
      //this.apply();
    },

    // 변경되는 값에따라 바로바로 ElementNode에 반영하고 랜더링을 진행한다.
    onThrowCatcherChangedValue( _eventData, _pass ){
      var elementNode = this.state.elementNode;
      var changedData = _eventData.data;

      if( _eventData.refPath[2] === 'HTMLDOMSpec'){
        if( _eventData.refPath[1] === 'elementDOMSpec' ){
          switch( _eventData.name ){
            case "TagName" :
              elementNode.setTagName( changedData );
              break;
            case "Classes" :
              elementNode.setClasses( changedData );
              break;
            case "Text" :
              elementNode.setText( changedData );
              break;
          }
        }

        if( _eventData.refPath[1] === 'tagAttribute' ){
          switch( _eventData.name ){
            case "InlineStyle" :
              elementNode.setInlineStyle( changedData );
              break;
          }
        }
      } else if ( _eventData.refPath[2] === 'EmptyTypeElementNode' ){
        if( _eventData.refPath[1] === 'emptyTypeProps' ){
          switch( _eventData.name ){
            case "RefferenceType" :
              elementNode.setRefferenceType( changedData );
              break;
            case "DocumentRefKey" :
              elementNode.setRefferenceTarget( {documentRefKey: changedData} );
              break;
          }
        }
      }


      var elementDocument = elementNode.document;
      var contextController = elementDocument.getContextController();

      if( elementNode.getParent() !== null ){
        contextController.constructToRealElement( elementNode );
        elementNode.getParent().growupRealDOMElementTree();
      } else {
        contextController.rootRender();
      }

      this.setState({elementNode:elementNode});
    },


    getElementProfileFieldSet(_elementNode){
      return [
        { "name": "DocumentName", "initialValue": _elementNode.document.documentName, type:"static" },
        { "name": "ElementID", "initialValue": _elementNode.id, type:"static" },
        { "name": "ElementType", "initialValue": _elementNode.getType().toUpperCase(), type:"static" }
      ];
    },

    renderEditParts(_elementNode){
      var elementProfileFieldSet = this.getElementProfileFieldSet(_elementNode);

      var isEmptyType = false;

      if( _elementNode.getType() === 'empty' ) isEmptyType = true;

      return (
        <div className='edit-parts'>
          <HorizonFieldSet title="Element Profile" theme='dark' nameWidth={130} fields={ elementProfileFieldSet } ref='profile-set'/>

          <HTMLDOMSpec elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme} ref='HTMLDOMSpec'/>

          {isEmptyType? <EmptyTypeElementNode elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme} ref='EmptyTypeElementNode'/>:''}
        </div>
      );
    },

    render() {
        var rootClasses = ['ElementNodeEditor', this.props.config.theme, this.getMySizeClass()];

        var elementNode = this.state.elementNode;

        return (
            <div className={rootClasses.join(' ')}>
                <div className='wrapper'>
                  <div className='body'>
                    { elementNode !== null ? this.renderEditParts(elementNode):"No focused." }
                  </div>
                  <div className="footer">


                  </div>
                </div>
            </div>
        );
    }
});

module.exports = ElementNodeEditor;
