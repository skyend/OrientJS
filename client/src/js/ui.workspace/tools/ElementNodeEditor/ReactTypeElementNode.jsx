var React = require("react");

var HorizonFieldSet = require('../../partComponents/HorizonFieldSet.jsx');

var ReactTypeElementNode = React.createClass({
  mixins: [
    require('../../reactMixin/EventDistributor.js'),
    require('../mixins/WidthRuler.js')],

  getDefaultProps(){
    return {
      elementNode: null
    };
  },

  render() {

    var rootClasses = ['part', this.props.theme, this.getMySizeClass()];

    var elementNode = this.props.elementNode;

    if( elementNode.loadedComponent === null ){
      return "Not found ReactComponent Info";
    }

    let propertyKeys = Object.keys(elementNode.loadedComponent.propStruct || {});

    let profileFieldSet = propertyKeys.map(function(_propKey){
      let prop = elementNode.loadedComponent.propStruct[_propKey];

      console.log(prop);

      if( prop.preparedData !== undefined ){

      }

      return {
        name: _propKey,
        title: prop.title,
        initialValue: elementNode.getReactComponentProp(_propKey) || '',
        enterable: true,
        height: 50,
//        type:'selectable',
        type:'textarea',
        options:[{value:1, title:"Hello"}, {value:2, title:'everyone'}]
      };
    });


    console.log( 'React elemntnode', elementNode.loadedComponent );

    return (
      <div className={rootClasses.join(' ')}>
        <HorizonFieldSet title="React Component Properties" theme='dark' nameWidth={130} fields={ profileFieldSet } ref='reactComponentProps'/>
      </div>
    );
  }
});

export default ReactTypeElementNode;
