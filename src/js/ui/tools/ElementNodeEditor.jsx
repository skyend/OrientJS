
var React = require("react");
require('./ElementNodeEditor.less');

var BasicButton = require('../partComponents/BasicButton.jsx');
var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');
var HorizonField = require('../partComponents/HorizonField.jsx');
var HorizonFieldSet = require('../partComponents/HorizonFieldSet.jsx');
var htmlTag = require('./toolsData/htmlTag.json');

var ElementProfile = require('./ElementNodeEditor/ElementProfile.jsx');
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

      if( _eventData.refPath[2] === 'ElementProfile'){

        if( _eventData.refPath[1] === 'profile-set' ){
          switch( _eventData.name ){
            case "Name" :
              elementNode.setName( changedData );
              break;
          }
        }

      } else if ( _eventData.refPath[2] === 'HTMLDOMSpec'){
        if( _eventData.refPath[1] === 'elementDOMSpec' ){
          switch( _eventData.name ){
            case "TagName" :
              elementNode.setTagName( changedData );
              this.refreshElementNodeRendering( elementNode );
              break;
            case "Id" :
              elementNode.setIdAtrribute( changedData );
              break;
            case "Classes" :
              elementNode.setClasses( changedData );
              break;
            case "Text" :
              elementNode.setText( changedData );
              break;
            case "Comment" :
              elementNode.setComment( changedData );
              break;
          }

        }

        if( _eventData.refPath[1] === 'tagAttribute' ){
          switch( _eventData.name ){
            case "InlineStyle" :
              elementNode.setInlineStyle( changedData );
              break;
            default:
              elementNode.setAttribute(  _eventData.name, changedData );
          }
        }

        if( _eventData.refPath[1] === 'dataAttribute' ){
          elementNode.setAttribute(  _eventData.name, changedData );
        }



        // attribute를 실제 요소에 반영
        elementNode.applyAttributesToRealDOM();
      } else if ( _eventData.refPath[2] === 'EmptyTypeElementNode' ){
        if( _eventData.refPath[1] === 'emptyTypeProps' ){
          switch( _eventData.name ){
            case "RefferenceType" :
              elementNode.setRefferenceType( changedData );
              break;
            case "RefferenceTarget" :
              elementNode.setRefferenceTarget( changedData );
              break;
          }
        }

        // 변경된 참조 정보를 요소로부터 갱신

        this.refreshElementNodeRendering( elementNode );
      }



      this.setState({elementNode:elementNode});
      elementNode.executeSnapshot();

    },

    refreshElementNodeRendering( _elementNode ){
      var elementDocument = _elementNode.document;
      var contextController = elementDocument.getContextController();

      if( _elementNode.getParent() !== null ){
        contextController.constructToRealElement( _elementNode );
        _elementNode.getParent().linkRealDOMofChild();
      } else {
        contextController.rootRender();
      }
    },


    renderEditParts(_elementNode){

      var isEmptyType = false;

      if( _elementNode.getType() === 'empty' ) isEmptyType = true;

      return (
        <div className='edit-parts'>
          <ElementProfile  elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme} ref='ElementProfile'/>

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
