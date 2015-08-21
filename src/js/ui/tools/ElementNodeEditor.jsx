
var React = require("react");
require('./ElementNodeEditor.less');

var BasicButton = require('../partComponents/BasicButton.jsx');
var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');
var HorizonField = require('../partComponents/HorizonField.jsx');

var ElementNodeEditor = React.createClass({
    mixins: [
        require('../reactMixin/EventDistributor.js'),
        require('./mixins/WidthRuler.js')],

    getInitialState(){
        return {
          elementNode:null
        };
    },

    renderElementInfo(_elementNode){
      var nameWidth = 120;

      return (
        <div className='part'>
          <div className='part-head'>
            <label> Element Profile </label>
          </div>
          <HorizonField fieldName="DocumentName" theme="dark" type='static'
                       fieldValue={_elementNode.document.documentName}
                       width={this.props.width-2}
                       nameWidth={nameWidth}/>

         <HorizonField fieldName="ElementID" theme="dark" type='static'
                      fieldValue={_elementNode.id}
                      width={this.props.width-2}
                      nameWidth={nameWidth}/>

          <HorizonField fieldName="ElementType" theme="dark" type='static'
                       fieldValue={_elementNode.getType().toUpperCase()}
                       width={this.props.width-2}
                       nameWidth={nameWidth}/>

         <HorizonField fieldName="ElementType" theme="dark" type='enterable'
                      fieldValue={_elementNode.getType().toUpperCase()}
                      width={this.props.width-2}
                      nameWidth={nameWidth}/>
        </div>
      );
    },

    renderEditParts(_elementNode){
      return (
        <div className='edit-parts'>

          { this.renderElementInfo(_elementNode) }

        </div>
      );
    },

    render() {
        var rootClasses = ['ElementNodeEditor', this.props.config.theme, this.getMySizeClass()];

        var elementNode = this.state.elementNode;

        return (
            <div className={rootClasses.join(' ')}>
                <div className='wrapper'>
                  { elementNode !== null ? this.renderEditParts(elementNode):"" }
                </div>
            </div>
        );
    }
});

module.exports = ElementNodeEditor;
