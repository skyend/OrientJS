import React from "react";
import './ElementNodeEditor.less';

import BasicButton from '../partComponents/BasicButton.jsx';
import InputBoxWithSelector from '../partComponents/InputBoxWithSelector.jsx';
import HorizonField from '../partComponents/HorizonField.jsx';
import HorizonFieldSet from '../partComponents/HorizonFieldSet.jsx';
import htmlTag from './toolsData/htmlTag.json';

import ElementProfile from './ElementNodeEditor/ElementProfile.jsx';
import HTMLDOMSpec from './ElementNodeEditor/HTMLDOMSpec.jsx';
import EmptyTypeElementNode from './ElementNodeEditor/EmptyTypeElementNode.jsx';
import ReactTypeElementNode from './ElementNodeEditor/ReactTypeElementNode.jsx';
import RefTypeElementNode from './ElementNodeEditor/RefTypeElementNode.jsx';

let ElementNodeEditor = React.createClass({
  mixins: [
    require('../reactMixin/EventDistributor.js'),
    require('./mixins/WidthRuler.js')],

  getDefaultProps(){
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
    var elementNode = this.props.elementNode;
    console.log("Changed ID", elementNode.id);

    var changedData = _eventData.data;

    if (_eventData.refPath[2] === 'ElementProfile') {

      if (_eventData.refPath[1] === 'profile-set') {
        switch (_eventData.name) {
          case "Name" :
            this.props.contextController.modifyElementProperty(elementNode.id, 'Name', changedData);
            break;
        }
      }

    } else if (_eventData.refPath[2] === 'HTMLDOMSpec') {
      if (_eventData.refPath[1] === 'elementDOMSpec') {
        console.log(_eventData.name, changedData);

        switch (_eventData.name) {
          case "TagName" :
            this.props.contextController.modifyElementProperty(elementNode.id, 'tagName', changedData);
            break;
          case "Id" :
            this.props.contextController.modifyElementAttribute(elementNode.id, 'id', changedData);
            break;
          case "Classes" :
            this.props.contextController.modifyElementAttribute(elementNode.id, 'class', changedData);
            break;
          case "Text" :
            this.props.contextController.modifyElementProperty(elementNode.id, 'text', changedData);
            break;
          case "Comment" :
            this.props.contextController.modifyElementProperty(elementNode.id, 'Comment', changedData);
            break;
        }

      }

      if (_eventData.refPath[1] === 'tagAttribute') {
        switch (_eventData.name) {
          case "InlineStyle" :
            this.props.contextController.modifyElementAttribute(elementNode.id, 'style', changedData);
            break;
          default:
            this.props.contextController.modifyElementAttribute(elementNode.id, _eventData.name, changedData);
        }
      }

      if (_eventData.refPath[1] === 'dataAttribute') {
        this.props.contextController.modifyElementAttribute(elementNode.id, _eventData.name, changedData);
      }

    } else if (_eventData.refPath[2] === 'EmptyTypeElementNode') {
      if (_eventData.refPath[1] === 'emptyTypeProps') {
        switch (_eventData.name) {
          case "RefferenceType" :
            this.props.contextController.modifyElementProperty(elementNode.id, 'refferenceType', changedData);
            break;
          case "RefferenceTarget" :
            this.props.contextController.modifyElementProperty(elementNode.id, 'refferenceTarget', changedData);
            break;
        }
      }
    } else if (_eventData.refPath[2] === 'RefTypeElementNode') {
      if (_eventData.refPath[1] === 'refComponentProps') {
        switch (_eventData.name) {
          case "refType" :
            this.props.contextController.modifyElementProperty(elementNode.id, 'refType', changedData);
            break;
          case "refTargetId" :
            this.props.contextController.modifyElementProperty(elementNode.id, 'refTargetId', changedData);
            break;
        }
      }
    }else if (_eventData.refPath[2] === 'ReactTypeElementNode' ){
      if(_eventData.refPath[1] === 'reactComponentProps' ){
        let propKey = _eventData.name;
        this.props.contextController.modifyReactElementProperty(elementNode.id, propKey, changedData);
      }
    }


    this.setState({elementNode: elementNode});
  },

  renderSpecialPartByType(_elementNode){
    let type = _elementNode.getType();

    if( type === 'empty' ){
      return <EmptyTypeElementNode elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme} ref='EmptyTypeElementNode'/>;
    } else if ( type === 'react' ){
      return <ReactTypeElementNode elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme} ref='ReactTypeElementNode'/>;
    } else if ( type === 'ref' ){
      return <RefTypeElementNode elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme} ref='RefTypeElementNode'/>;
    } else {
      return '';
    }
  },

  renderEditParts(_elementNode){

    return (
      <div className='edit-parts'>
        <ElementProfile elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme} ref='ElementProfile'/>

        <HTMLDOMSpec elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme} ref='HTMLDOMSpec'/>

        { this.renderSpecialPartByType(_elementNode) }
      </div>
    );
  },

  render() {
    var rootClasses = ['ElementNodeEditor', this.props.config.theme, this.getMySizeClass()];

    var elementNode = this.props.elementNode;

    return (
      <div className={rootClasses.join(' ')}>
        <div className='wrapper'>
          <div className='body'>
            { elementNode !== null && elementNode !== undefined ? this.renderEditParts(elementNode) : "No focused." }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ElementNodeEditor;
