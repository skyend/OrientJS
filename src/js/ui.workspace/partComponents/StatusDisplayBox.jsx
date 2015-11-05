(function () {
  require('./StatusDisplayBox.less');
  var React = require("react");

  var ReactClass = React.createClass({
    getInitialState() {
      return {
        statusLevel: 'primary',
        statusMessage: 'none'
      }
    },

    render() {
      var statusColor;

      switch (this.state.statusLevel) {
        case "warnings":
          statusColor = 'yellow';
          break;
        case "error":
          statusColor = 'red';
          break;
        case "success":
          statusColor = 'green';
          break;
        case "primary":
          statusColor = 'blue';
          break;
        case "info":
          statusColor = 'white';
          break;
      }

      var ledClass = 'led-' + statusColor;

      return (
        <div className="StatusDisplayBox white-background red">
          <div className='dashboard-wrapper'>
            <div className='dashboard'>
              <div className='led-light'>
                <div className={ledClass}></div>
              </div>
              <div className={'tag ' + statusColor}>
                Not Connected
              </div>
            </div>
          </div>
        </div>
      )
    }
  });


  module.exports = ReactClass;

})();
