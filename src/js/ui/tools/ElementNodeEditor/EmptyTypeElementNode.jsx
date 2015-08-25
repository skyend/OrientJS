
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
          { "name": "RefferenceType", "initialValue": elementNode.getRefferenceType() || 'Refference nothing', enterable:true, type:'select', options:refTypeOptions },
          { "name": "RefferenceKey", "initialValue": '준비중', enterable:true, type:'input'},
        ];

        var refferenceTarget =  elementNode.getRefferenceTarget();

        if( elementNode.getRefferenceType() === 'react' ){
          emptyFieldSet.push( { "name": "PackageKey", "initialValue": refferenceTarget.packageKey || 'none', enterable:false, } );
          emptyFieldSet.push( { "name": "ComponentKey", "initialValue": refferenceTarget.componentKey || 'none', enterable:false, } );
        } else if ( elementNode.getRefferenceType() === 'document'  ){
          emptyFieldSet.push( { "name": "DocumentRefKey", "initialValue": refferenceTarget.documentRefKey || 'none', enterable:true, type:'input' } );
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
