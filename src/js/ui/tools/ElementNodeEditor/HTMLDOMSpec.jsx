
var React = require("react");
var _ = require('underscore');

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

    onThrowCatcherNewFieldAdd(_eventData, _pass){
      if( _eventData.refPath[0] === "dataAttribute" ){
        this.props.elementNode.setAttribute("data-new", "");


        this.forceUpdate();
      }
    },

    render() {

        var rootClasses = ['part', this.props.theme, this.getMySizeClass()];

        var elementNode = this.props.elementNode;

        var htmlTagSelectOptions = htmlTag.map(function( _tagObj ){
          return { value: _tagObj.tagName };
        });

        var elementSpecFieldSet = [
          { "name": "TagName", title:"태그명","initialValue": elementNode.getTagName() || '', type:"select" , "enterable":true, options:htmlTagSelectOptions},
          { "name": "Classes", title:"클래스","initialValue":elementNode.getClasses() || '', type:"input"  , "enterable":true},
          { "name": "Comment", title:"주석","initialValue":elementNode.getComment() , type:"textarea"  , "enterable":true, height:50}
        ];

        var tagAttributeFieldSet = [
          { "name": "InlineStyle",  title:"인라인스타일","initialValue": elementNode.getInlineStyle() || '', enterable:true, type:'ace' , lang:'css',height:100},
        ];

        var dataAttributeFieldSet = [];

        if ( elementNode.getType() === 'string' ){
          elementSpecFieldSet = [ { "name": "Text",  title:"텍스트", "initialValue":elementNode.getText() || '', type:"textarea"  ,  lang:'plain',"enterable":true,height:50} ];
        } else {
          var targetTagSpecIndex = _.findIndex(htmlTag, {tagName:elementNode.getTagName()});
          var targetTagSpec = htmlTag[targetTagSpecIndex];

          tagAttributeFieldSet.push( { "name": "title",  title:"tooltipMsg", "initialValue":elementNode.getAttribute('title') || '', type:"input"  , "enterable":true} )

          targetTagSpec.attributes.map( function( _attrSpec ){
            tagAttributeFieldSet.push( { "name": _attrSpec.n,  title:_attrSpec.title, "initialValue":elementNode.getAttribute(_attrSpec.n) || '', type:"input", "enterable":true} )
          });

          var elementAttrKeys = Object.keys(elementNode.getAttributes());

          elementAttrKeys.map( function(_key){
            if( /^data-.*/.test( _key ) ){
              dataAttributeFieldSet.push({ "name": _key, title:_key,"initialValue":elementNode.getAttribute(_key)|| '', type:"input"  , "enterable":true});
            }
          });
        }



        return (
            <div className={rootClasses.join(' ')}>
              <HorizonFieldSet title="Element DOM Spec" theme={ this.props.theme} nameWidth={130} fields={ elementSpecFieldSet } ref='elementDOMSpec'/>
              {elementNode.getType() !== 'string'? <HorizonFieldSet title="Tag Attributes" theme={ this.props.theme} nameWidth={130} fields={ tagAttributeFieldSet } ref='tagAttribute'/>:''}
              {elementNode.getType() !== 'string'? <HorizonFieldSet title="Data Attributes" theme={ this.props.theme} nameWidth={130} fields={ dataAttributeFieldSet } extendable={true} ref='dataAttribute'/>:''}
            </div>
        );
    }
});

module.exports = HTMLDOMSpec;
