var IFrameStage = require('./partComponents/IFrameStage.jsx');
var React = require('react');

var DirectContext = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  appendElementToBody( _element ){
    return this.getIFrameStage().insertElementToInLastBySelector('body', _element);
  },

  deployComponentToInLast( _vid, _staticElement, _component ){
    console.log("deployed component", _component);

    var dropTarget = this.getIFrameStage().getElementByVid(_vid);

    this.contextController.insertNewElementNodeFromComponent('appendChild',_component, dropTarget);
    //return this.getIFrameStage().insertElementToInLastByVid(_vid, _staticElement);
  },

  deployComponentToBefore( _vid, _staticElement, _component ){
    console.log("deployed component", _component);
    return this.getIFrameStage().insertElementToBeforeByVid(_vid, _staticElement);
  },

  deployComponentToAfter( _vid, _staticElement, _component ){
    console.log("deployed component", _component);
    return this.getIFrameStage().insertElementToAfterByVid(_vid, _staticElement);
  },

  addStyle( _key, _css ){
    this.getIFrameStage().addStyle( _key, _css );
  },

  applyStyleElement( _element ){
    this.getIFrameStage().appendStyleElement( _element );
  },

  applyScriptElement( _element ){
    this.getIFrameStage().appendScriptElementToHead( _element );
  },

  getIFrameStageInnerWindow(){
    return this.getIFrameStage().getIframeInnerWindow();
  },

  getIFrameStageInnerDoc(){
    return this.getIFrameStage().getIFrameInnerDoc();
  },

  getIFrameStageBoundingRect(){
    return this.getIFrameStage().getDOMNode().getBoundingClientRect();
  },

  getIFrameStageScrollY(){
    return this.getIFrameStage().getScrollY();
  },

  getIFrameStage(){
    return this.refs['iframe-stage'];
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
