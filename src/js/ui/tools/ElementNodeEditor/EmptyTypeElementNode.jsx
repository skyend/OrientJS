
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
          { value:'react' },
          { value:'document'},
          { value: 'elementNode'},
          { value: 'none' }
        ];

        var emptyFieldSet = [
          { "name": "RefferenceType", title:"참조 타입", "initialValue": elementNode.getRefferenceType() || 'Refference nothing', enterable:true, type:'select', options:refTypeOptions },
        //  { "name": "RefferenceKey", title:"참조 키", "initialValue": '준비중', enterable:true, type:'input'},
        ];


        if( elementNode.getRefferenceType() === 'react' ){
          emptyFieldSet.push( { "name": "RefferenceTarget",  title:"대상 ID","initialValue": elementNode.getRefferenceTarget() || 'none', enterable:false, } );
        } else if ( elementNode.getRefferenceType() === 'document'  ){
          emptyFieldSet.push( { "name": "RefferenceTarget",  title:"문서 참조 키","initialValue": elementNode.getRefferenceTarget() || '', enterable:true, type:'input' } );
        }

        var tagAttributesFieldSet = [];

        return (
            <div className={rootClasses.join(' ')}>
              <HorizonFieldSet title="Empty Type Properties" theme={ this.props.theme } nameWidth={130} fields={ emptyFieldSet } ref='emptyTypeProps'/>

            </div>
        );
    }
});

module.exports = EmptyTypeElementNode;
