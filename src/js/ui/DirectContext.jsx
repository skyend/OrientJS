var IFrameStage = require('./partComponents/IFrameStage.jsx');
var React = require('react');

var DirectContext = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  deployComponentToInLast( _vid, _staticElement ){
    return this.refs['iframe-stage'].insertElementToInLast(_vid, _staticElement);
  },

  deployComponentToBefore( _vid, _staticElement ){
    return this.refs['iframe-stage'].insertElementToBefore(_vid, _staticElement);
  },

  deployComponentToAfter( _vid, _staticElement ){
    return this.refs['iframe-stage'].insertElementToAfter(_vid, _staticElement);
  },

  addStyle( _key, _css ){
    this.refs['iframe-stage'].addStyle( _key, _css );
  },

  getIFrameStageInnerDoc(){
    return this.refs['iframe-stage'].getIFrameInnerDoc();
  },

  getIFrameStageBoundingRect(){
    return this.refs['iframe-stage'].getDOMNode().getBoundingClientRect();
  },

  getIFrameStageScrollY(){
    return this.refs['iframe-stage'].getScrollY();
  },

  render(){
    var style = {
      display:'none',
      width: this.props.width,
      height: this.props.height
    };

    if( this.props.runningState ){
      style.display = 'block';
    }

    return (
      <div style={style}>
        <IFrameStage ref='iframe-stage' width={this.props.width} height={this.props.height} src='../html5up-directive1/index.html'/>
      </div>
    );
  }
});


module.exports = DirectContext;
