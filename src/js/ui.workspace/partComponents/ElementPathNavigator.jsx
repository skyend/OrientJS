require('./ElementPathNavigator.less');
var React = require("react");

var ElementPathNavigator = React.createClass({

  render () {
    let style = {
      height: this.props.height
    };
    return (
      <div className='ElementPathNavigator theme-default' style={style}>
        <ul></ul>
      </div>
    )
  }
});

module.exports = ElementPathNavigator;
