
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

        var refTypeOptions = [
          { value:'react' , title:'React'},
          { value:'document' , title:'Document'},
          { value: 'html' , title:'ElementNode'},
          { value: 'none' }
        ];

        var emptyFieldSet = [
          { "name": "RefferenceType", title:"참조 타입", "initialValue": elementNode.getRefferenceType() || 'Refference nothing', enterable:true, type:'select', options:refTypeOptions },
        ];

        if( elementNode.getRefferenceType() !== 'none' ){
            if( elementNode.getRefferenceType() !== 'document' ){
              var options = [{value:'none', 'title':'참조 안함'}];

              elementNode.document.elementNodes.map(function(_elementNode){
                console.log('target', elementNode.getRefferenceTarget(), _elementNode.getId());
                  if( elementNode.getRefferenceTarget() == _elementNode.getId()){
                    options.push({value:_elementNode.getId(), title:(_elementNode.getId()+"")});
                  } else {
                    if( ! _elementNode.isReferenced() ){
                      options.push({value:_elementNode.getId(), title:_elementNode.getId()});
                    }
                  }
              });

              emptyFieldSet.push( { "name": "RefferenceTarget",  title:"참조 요소 ID","initialValue": elementNode.getRefferenceTarget() || 'none', enterable:true, type:'select', options:options } );
            } else {
              var options = [{value:'none', 'title':'참조 안함'}];
              emptyFieldSet.push( { "name": "RefferenceTarget",  title:"참조 문서 키","initialValue": elementNode.getRefferenceTarget() || 'none', enterable:true, type:'select', options:options } );

            }

        }


        var tagAttributesFieldSet = [];
        console.log('Empty render');
        return (
            <div className={rootClasses.join(' ')}>
              <HorizonFieldSet title="Empty Type Properties" theme={ this.props.theme } nameWidth={130} fields={ emptyFieldSet } ref='emptyTypeProps'/>

            </div>
        );
    }
});

module.exports = EmptyTypeElementNode;
