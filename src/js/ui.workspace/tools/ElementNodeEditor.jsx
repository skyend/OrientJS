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
      elementNode: null,
      contextController: null
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
  onThrowCatcherChangedValue(_eventData, _pass){
    var elementNode = this.state.elementNode;
    console.log("Changed ID", elementNode.id);

    var changedData = _eventData.data;

    if (_eventData.refPath[2] === 'ElementProfile') {

      if (_eventData.refPath[1] === 'profile-set') {
        switch (_eventData.name) {
          case "Name" :
            this.state.contextController.modifyElementProperty(elementNode.id, 'Name', changedData);
            break;
        }
      }

    } else if (_eventData.refPath[2] === 'HTMLDOMSpec') {
      if (_eventData.refPath[1] === 'elementDOMSpec') {
        switch (_eventData.name) {
          case "TagName" :
            this.state.contextController.modifyElementAttribute(elementNode.id, 'tagName', changedData);
            break;
          case "Id" :
            this.state.contextController.modifyElementAttribute(elementNode.id, 'id', changedData);
            break;
          case "Classes" :
            this.state.contextController.modifyElementAttribute(elementNode.id, 'class', changedData);
            break;
          case "Text" :
            this.state.contextController.modifyElementAttribute(elementNode.id, 'text', changedData);
            break;
          case "Comment" :
            this.state.contextController.modifyElementProperty(elementNode.id, 'Comment', changedData);
            break;
        }

      }

      if (_eventData.refPath[1] === 'tagAttribute') {
        switch (_eventData.name) {
          case "InlineStyle" :
            this.state.contextController.modifyElementAttribute(elementNode.id, 'style', changedData);
            break;
          default:
            this.state.contextController.modifyElementAttribute(elementNode.id, _eventData.name, changedData);
        }
      }

      if (_eventData.refPath[1] === 'dataAttribute') {
        this.state.contextController.modifyElementAttribute(elementNode.id, _eventData.name, changedData);
      }

    } else if (_eventData.refPath[2] === 'EmptyTypeElementNode') {
      if (_eventData.refPath[1] === 'emptyTypeProps') {
        switch (_eventData.name) {
          case "RefferenceType" :
            this.state.contextController.modifyElementProperty(elementNode.id, 'refferenceType', changedData);
            break;
          case "RefferenceTarget" :
            this.state.contextController.modifyElementProperty(elementNode.id, 'refferenceTarget', changedData);
            break;
        }
      }
    }


    this.setState({elementNode: elementNode});
    elementNode.executeSnapshot();
  },

  refreshElementNodeRendering(_elementNode){
    var elementDocument = _elementNode.document;
    var contextController = elementDocument.getContextController();

    if (_elementNode.getParent() !== null) {
      contextController.constructToRealElement(_elementNode);
      _elementNode.getParent().linkRealDOMofChild();
    } else {
      contextController.rootRender();
    }
  },


  renderEditParts(_elementNode){

    var isEmptyType = false;

    if (_elementNode.getType() === 'empty') isEmptyType = true;

    return (
      <div className='edit-parts'>
        <ElementProfile elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme}
                        ref='ElementProfile'/>

        <HTMLDOMSpec elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme}
                     ref='HTMLDOMSpec'/>

        {isEmptyType ? <EmptyTypeElementNode elementNode={_elementNode} width={this.props.width}
                                             theme={this.props.config.theme} ref='EmptyTypeElementNode'/> : ''}
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
            { elementNode !== null ? this.renderEditParts(elementNode) : "No focused." }
          </div>
          <div className="footer">


          </div>
        </div>
      </div>
    );
  }
});

module.exports = ElementNodeEditor;
