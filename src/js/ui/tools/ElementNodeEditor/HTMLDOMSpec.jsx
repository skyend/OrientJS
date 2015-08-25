
var React = require("react");

var HorizonFieldSet = require('../../partComponents/HorizonFieldSet.jsx');
var htmlTag = require('../toolsData/htmlTag.json');

var HTMLDOMSpec = React.createClass({
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

        var htmlTagSelectOptions = htmlTag.map(function( _tagObj ){
          return { value: _tagObj.tagName };
        });

        var elementSpecFieldSet = [
          { "name": "TagName", "initialValue": elementNode.getTagName() || '', type:"select" , "enterable":true, options:htmlTagSelectOptions},
          { "name": "Classes", "initialValue":elementNode.getClasses() || '', type:"input"  , "enterable":true}
        ];

        var tagAttributesFieldSet = [];

        return (
            <div className={rootClasses.join(' ')}>
              <HorizonFieldSet title="Element DOM Spec" theme={ this.props.theme} nameWidth={130} fields={ elementSpecFieldSet } ref='elementDOMSpec'/>
              <HorizonFieldSet title="Tag Attributes" theme={ this.props.theme} nameWidth={130} fields={ tagAttributesFieldSet } ref='tagAttribute'/>
            </div>
        );
    }
});

module.exports = HTMLDOMSpec;
