/**
 * StackInputSelector ReactClass
 *
 *  선택상자가 부착된 input 박스
 *
 * Requires : StackInputSelector.less, InputBoxWithSelector.jsx, ReactJS
 *
 * Event:
 *   onChanged( my field name, changed value)
 *
 * Props:
 *   fieldName :
 *     뛰어쓰기를 지양하는 필드의 unique한 id
 *
 *   selectorItems :
 *     필드의 선택가능한 입력 문자열의 배열
 */

(function () {
  require('./StackInputSelector.less');
  var InputBoxWithSelector = require('./InputBoxWithSelector.jsx');
  var React = require("react");

  var StackInputSelector = React.createClass({

    render(){
      var classes = ['StackInputSelector', this.props.color];

      return (
        <div className={classes.join(' ')}>

        </div>
      )
    }
  });


  module.exports = StackInputSelector;

})();
