
var React = require("react");

var HorizonFieldSet = require('../../partComponents/HorizonFieldSet.jsx');
var htmlTag = require('../toolsData/htmlTag.json');

var EmptyTypeElementNode = React.createClass({
    mixins: [
        require('../../reactMixin/EventDistributor.js'),
        require('../mixins/WidthRuler.js')],

    getInitialState(){
        return {
          elementNode:null
        };
    },

    render() {

        var rootClasses = ['part', this.props.theme, this.getMySizeClass()];

        var elementNode = this.props.elementNode;

        var profileFieldSet = [
          { "name": "DocumentName", title:"Document Name", "initialValue": elementNode.document.documentName, enterable:false },
          { "name": "ElementID",  title:"Element ID","initialValue": elementNode.id, enterable:false },
          { "name": "ElementType",  title:"Element Type","initialValue": elementNode.getType().toUpperCase(), enterable:false },
          { "name": "Name",  title:"요소 이름","initialValue": elementNode.getName(), enterable:true, type:'input' }
        ];

        return (
            <div className={rootClasses.join(' ')}>
              <HorizonFieldSet title="프로필" theme='dark' nameWidth={130} fields={ profileFieldSet } ref='profile-set'/>
            </div>
        );
    }
});

module.exports = EmptyTypeElementNode;
