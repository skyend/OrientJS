(function () {
  require('./FoldableContainerWithHeader.less');

  var React = require("react");

  var ReactClass = React.createClass({
    getInitialState() {
      return {
        fold: false
      }
    },

    toggle() {
      this.setState({fold: !this.state.fold});
    },

    render() {
      var iconClasses = [];
      iconClasses.push('fa');

      if (this.state.fold) {
        iconClasses.push('fa-chevron-down');
      } else {
        iconClasses.push('fa-chevron-up');
      }

      return (
        <div className="FoldableContainerWithHeader gray">
          <div className='header'>
            {this.props.title}
            <div className='toggle' onClick={this.toggle}>
              <i className={iconClasses.join(' ')}></i>
            </div>
          </div>
          <div classNmae='body' style={{display: this.state.fold ? 'none' : 'block'}}>
            { this.props.componentElements }
          </div>
        </div>
      )
    }
  });


  module.exports = ReactClass;

})();
