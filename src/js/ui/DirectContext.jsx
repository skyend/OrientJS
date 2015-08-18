var IFrameStage = require('./partComponents/IFrameStage.jsx');
var React = require('react');

var DirectContext = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  deployComponentToInLast( _vid, _staticElement, _component ){
    console.log("deployed component", _component);
    return this.refs['iframe-stage'].insertElementToInLastByVid(_vid, _staticElement);
  },

  deployComponentToBefore( _vid, _staticElement, _component ){
    console.log("deployed component", _component);
    return this.refs['iframe-stage'].insertElementToBeforeByVid(_vid, _staticElement);
  },

  deployComponentToAfter( _vid, _staticElement, _component ){
    console.log("deployed component", _component);    
    return this.refs['iframe-stage'].insertElementToAfterByVid(_vid, _staticElement);
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

  goingToContextStop(){
    this.contextController.pause();
    console.log('changed context state to stop!');
  },

  goingToContextRunning(){
    this.contextController.resume();
    console.log('changed context state to running!');
  },

  componentDidUpdate(){
    if( this.props.runningState ){
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  componentDidMount(){
    // contextController 연결
    this.contextController = this.props.contextController;
    this.contextController.attach(this);

    if( this.props.runningState ){
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
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
        <IFrameStage ref='iframe-stage' width={this.props.width} height={this.props.height}/>
      </div>
    );
  }
});


module.exports = DirectContext;
