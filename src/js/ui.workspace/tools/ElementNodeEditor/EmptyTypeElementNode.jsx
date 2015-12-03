var React = require("react");

var HorizonFieldSet = require('../../partComponents/HorizonFieldSet.jsx');
var htmlTag = require('../toolsData/htmlTag.json');

var EmptyTypeElementNode = React.createClass({
  mixins: [
    require('../../reactMixin/EventDistributor.js'),
    require('../mixins/WidthRuler.js')],

  getDefaultProps(){
      return {
        elementNode : null
      };
  },

  render() {

    var rootClasses = ['part', this.props.theme, this.getMySizeClass()];

    var elementNode = this.props.elementNode;

    var refTypeOptions = [
      {value: 'react', title: 'React'},
      {value: 'document', title: 'Document'},
      {value: 'html', title: 'HTML'},
      {value: 'empty', title: 'Empty'},
      {value: 'none'}
    ];

    var emptyFieldSet = [
      {
        "name": "RefferenceType",
        title: "참조 타입",
        "initialValue": elementNode.getRefferenceType() || 'Refference nothing',
        enterable: true,
        type: 'select',
        options: refTypeOptions
      },
    ];

    var tempArray;
    if (elementNode.getRefferenceType() !== 'none') {
      if (elementNode.getRefferenceType() !== 'document') {

        var options = [{value: elementNode.getRefferenceTarget(), 'title': '선택'}, {
          value: 'none',
          'title': '참조 안함'
        }];

        var refferencingInfoArray = [];
        elementNode.environment.elementNodes.map(function (_elementNode) {

          tempArray = [_elementNode.getName(), " [ " + _elementNode.getId() + " ] ", "( " + _elementNode.getType() + " )"];

          if (elementNode.getRefferenceTarget() == _elementNode.getId()) {
            //options.push({ value:_elementNode.getId(), title:'selected'});

            refferencingInfoArray = tempArray;
          } else {
            if (!_elementNode.isReferenced()) {


              options.push({value: _elementNode.getId(), title: tempArray.join("")});
            }
          }
        });


        emptyFieldSet.push({
          "name": "Refferencing Id",
          title: "참조중인 요소 ID",
          "initialValue": refferencingInfoArray.join(" "),
          enterable: false
        });
        emptyFieldSet.push({
          "name": "RefferenceTarget",
          title: "참조 요소 변경",
          "initialValue": elementNode.getRefferenceTarget() || 'none',
          enterable: true,
          type: 'select',
          options: options
        });
      } else {
        var options = [{value: 'none', 'title': '참조 안함'}];
        emptyFieldSet.push({
          "name": "RefferenceTarget",
          title: "참조 문서 키",
          "initialValue": elementNode.getRefferenceTarget() || 'none',
          enterable: true,
          type: 'select',
          options: options
        });

      }

    }


    var tagAttributesFieldSet = [];
    console.log('Empty render');
    return (
      <div className={rootClasses.join(' ')}>
        <HorizonFieldSet title="Empty Type 속성" theme={ this.props.theme } nameWidth={130}
                         fields={ emptyFieldSet } ref='emptyTypeProps'/>

      </div>
    );
  }
});

module.exports = EmptyTypeElementNode;
