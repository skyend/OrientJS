
var React = require("react");
require('./ElementNodeEditor.less');

var BasicButton = require('../partComponents/BasicButton.jsx');
var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');
var HorizonField = require('../partComponents/HorizonField.jsx');
var HorizonFieldSet = require('../partComponents/HorizonFieldSet.jsx');

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
      this.apply();
    },

    apply(){
      var specData = this.refs['spec-set'].getAllFieldData();
      var elementNode = this.state.elementNode;

      specData.map( function( _fieldData ){
        switch( _fieldData.name ){
          case "Classes":
          elementNode.setClasses( _fieldData.data );
          break;
          case "TagName":
          elementNode.setTagName( _fieldData.data );
          break;
        }
      });




      var elementDocument = elementNode.document;
      var contextController = elementDocument.getContextController();

      contextController.constructToRealElement( elementNode );
      elementNode.getParent().growupRealDOMElementTree();
      this.setState({elementNode:elementNode});
    },

    componentDidUpdate(){

    },

    getEmptyFieldSet(_elementNode){
      var emptyFieldSet = [
        { "name": "RefferenceType", "initialValue": _elementNode.getRefferenceType() || 'Refference nothing', type:"static" },
      ];

      if( _elementNode.getRefferenceType() === 'react' ){
        var refferenceTarget =  _elementNode.getRefferenceTarget();
        emptyFieldSet.push( { "name": "PackageKey", "initialValue": refferenceTarget.packageKey || 'none', type:"static" } );
        emptyFieldSet.push( { "name": "ComponentKey", "initialValue": refferenceTarget.componentKey || 'none', type:"static" } );
      }

      return emptyFieldSet;
    },

    getEmptyRefferencePropFieldSet(_elementNode){
      return [];
    },

    getElementProfileFieldSet(_elementNode){
      return [
        { "name": "DocumentName", "initialValue": _elementNode.document.documentName, type:"static" },
        { "name": "ElementID", "initialValue": _elementNode.id, type:"static" },
        { "name": "ElementType", "initialValue": _elementNode.getType().toUpperCase(), type:"static" }
      ];
    },

    getElementSpecFieldSet(_elementNode){
      return [
        { "name": "TagName", "initialValue": _elementNode.getTagName() || '', type:"enterable" },
        { "name": "Classes", "initialValue":_elementNode.getClasses() || '', type:"enterable" }
      ];
    },


    renderEditParts(_elementNode){

      var elementProfileFieldSet = this.getElementProfileFieldSet(_elementNode);
      var elementSpecFieldSet = this.getElementSpecFieldSet(_elementNode);
      var tagAttributesFieldSet = [];
      var emptyFieldSet;
      var emptyTargetPropFieldSet;
      var isEmptyType = false;

      if( _elementNode.getType() === 'empty' ){
        isEmptyType = true;
        emptyFieldSet = this.getEmptyFieldSet(_elementNode);
        emptyTargetPropFieldSet = this.getEmptyRefferencePropFieldSet( _elementNode);
      }


      return (
        <div className='edit-parts'>
          <HorizonFieldSet title="Element Profile" theme='dark' nameWidth={130} fields={ elementProfileFieldSet } ref='profile-set'/>
          <HorizonFieldSet title="Element Spec" theme='dark' nameWidth={130} fields={ elementSpecFieldSet } ref='spec-set'/>
          <HorizonFieldSet title="Tag Attributes" theme='dark' nameWidth={130} fields={ tagAttributesFieldSet } ref='tag-attrs-set'/>
          {isEmptyType? <HorizonFieldSet title="Empty Type Properties" theme='dark' nameWidth={130} fields={ emptyFieldSet } ref='empty-config-set'/>:''}
          {isEmptyType? <HorizonFieldSet title="Empty Target Properties" theme='dark' nameWidth={130} fields={ emptyTargetPropFieldSet } ref='empty-config-set'/>:''}
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
                    <input type='checkbox'/> auto apply
                    <BasicButton desc="Reset" color='error' size='small' onClick={this.onClickReset}/>
                    <BasicButton desc="Apply" color='primary' size='small' onClick={this.onClickApply}/>
                  </div>
                </div>
            </div>
        );
    }
});

module.exports = ElementNodeEditor;
