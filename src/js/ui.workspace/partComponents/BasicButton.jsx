(function () {
  require('./BasicButton.less');
  var React = require("react");

  var BasicButton = React.createClass({
    getDefaultProps(){
      return {
        onClick: null
      }
    },
    render() {
      var classes = [];
      classes.push('BasicButton');
      classes.push(this.props.color);
      classes.push(this.props.size);

      return (
        <button className={classes.join(' ')} onClick={ this.props.onClick }>
          { this.props.desc }
        </button>
      );
    }
  });


  module.exports = BasicButton;

})();
