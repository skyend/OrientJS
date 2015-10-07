
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

    onThrowCatcherRemoveField(_eventData, _pass){

    },

    onThrowCatcherRenameField(_eventData, _pass){
      if( _eventData.refPath[1] === "dataAttribute" ){

        if(  /data-\w+/.test(_eventData.current) ){

          this.props.elementNode.renameAttribute(_eventData.past, _eventData.current);
        } else {

          this.emit('NoticeMessage', {
            title:"필드명을 변경할 수 없습니다.",
            message:"해당 필드의 이름은 data-로 시작하여야 합니다.",
            level:"error"
          });
        }

        this.forceUpdate();
      }
    },

    onThrowCatcherNewFieldAdd(_eventData, _pass){
      if( _eventData.refPath[0] === "dataAttribute" ){

        // elementNode에 새 attribute를 할당
        this.props.elementNode.setAttribute("data-"+Math.floor(Math.random()*99999), "");

        this.forceUpdate();
      }
    },

    onThrowCatcherRemoveField(_eventData, _pass){
      if( _eventData.refPath[1] === "dataAttribute" ){

        // elementNode에 새 attribute를 할당
        this.props.elementNode.removeAttribute(_eventData.fieldName);

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
          { "name": "Id", title:"아이디","initialValue":elementNode.getIdAtrribute() || '', type:"input"  , "enterable":true},
          { "name": "Comment", title:"주석","initialValue":elementNode.getComment() , type:"textarea"  , "enterable":true, height:50}
        ];

        var tagAttributeFieldSet = [
          { "name": "InlineStyle",  title:"인라인스타일","initialValue": elementNode.getInlineStyle() || '', enterable:true, type:'ace' , lang:'css',height:100},
        ];

        var dataAttributeFieldSet = [];

        if ( elementNode.getType() === 'string' ){
          elementSpecFieldSet = [ { "name": "Text",  title:"텍스트", "initialValue":elementNode.getText() || '', type:"textarea", "enterable":true ,height:50} ];
        } else {
          var targetTagSpecIndex = _.findIndex(htmlTag, {tagName:elementNode.getTagName()});
          var targetTagSpec = htmlTag[targetTagSpecIndex];

          tagAttributeFieldSet.push( { "name": "title",  title:"tooltipMsg", "initialValue":elementNode.getAttribute('title') || '', type:"input"  , "enterable":true} )

          targetTagSpec.attributes.map( function( _attrSpec ){
            var fieldConfig = {
              name: _attrSpec.n,
              title:_attrSpec.title || _attrSpec.n,
              initialValue:elementNode.getAttribute(_attrSpec.n) || '',
              type:'input',
              enterable:true};

            switch(_attrSpec.type){
              case "select":
                fieldConfig.type = "select";

                fieldConfig.options = _attrSpec.options;
                break;
              case "string":
                fieldConfig.type = "input";
                break;
            }


            tagAttributeFieldSet.push( fieldConfig )
          });

          var elementAttrKeys = Object.keys(elementNode.getAttributes());

          elementAttrKeys.map( function(_key){
            if( /^data-.*/.test( _key ) ){
              dataAttributeFieldSet.push({ "name": _key, title:_key,"initialValue":elementNode.getAttribute(_key)|| '', type:"input"  , "enterable":true, "deletable":true, editorableFieldName:true});
            }
          });
        }



        return (
            <div className={rootClasses.join(' ')}>
              <HorizonFieldSet title="DOM 명세표" theme={ this.props.theme} nameWidth={130} fields={ elementSpecFieldSet } ref='elementDOMSpec'/>
              {elementNode.getType() !== 'string'? <HorizonFieldSet title="Tag 지원 속성" theme={ this.props.theme} nameWidth={130} fields={ tagAttributeFieldSet } ref='tagAttribute'/>:''}
              {elementNode.getType() !== 'string'? <HorizonFieldSet title="Tag 명시 데이터" theme={ this.props.theme} nameWidth={130} fields={ dataAttributeFieldSet } extendable={true} ref='dataAttribute'/>:''}
            </div>
        );
    }
});

module.exports = HTMLDOMSpec;
