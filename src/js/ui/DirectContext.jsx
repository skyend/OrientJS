var IFrameStage = require('./partComponents/IFrameStage.jsx');
var React = require('react');

var DirectContext = React.createClass({

  render(){
    return (
      <IFrameStage ref='iframe-stage' width={this.props.width} height={this.props.height} src='../html5up-directive1/index.html'/>
    );
  }
});


module.exports = DirectContext;
