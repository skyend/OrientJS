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

    var result = this.contextController.insertNewElementNodeFromComponent('appendChild',_component, dropTarget);




    if( ! result ) {
      this.emit("NoticeMessage",{
        "title" : "해당 컴포넌트를 삽입 할 수 없습니다.",
        "message" : "드랍하고자 하는 ElementNode에는 해당 컴포넌트를 허용하지 않습니다.",
        "level" : 'error'
      });

      this.emit('NoticeMessage',{
        title:"component 삽입실패",
        message:"영역을 확인하여 주세요. 최초에 RootWrapper를 삽입하시는것을 권장합니다.",
        level : "error"

      });
    }

    //return this.getIFrameStage().insertElementToInLastByVid(_vid, _staticElement);
  },

  deployComponentToBefore( _vid, _staticElement, _component ){
    var dropTarget = this.getIFrameStage().getElementByVid(_vid);

    var result = this.contextController.insertNewElementNodeFromComponent('insertBefore',_component, dropTarget);

    // console.log("deployed component", _component);
    // return this.getIFrameStage().insertElementToBeforeByVid(_vid, _staticElement);
  },

  deployComponentToAfter( _vid, _staticElement, _component ){
    var dropTarget = this.getIFrameStage().getElementByVid(_vid);

    var result = this.contextController.insertNewElementNodeFromComponent('insertAfter',_component, dropTarget);

    // console.log("deployed component", _component);
    // return this.getIFrameStage().insertElementToAfterByVid(_vid, _staticElement);
  },

  addStyle( _key, _css ){
    //this.getIFrameStage().addStyle( _key, _css );
  },

  applyStyleElement( _element ){
    this.getIFrameStage().appendStyleElement( _element );
  },

  applyScriptElement( _element ){
    this.getIFrameStage().appendScriptElementToHead( _element );
  },

  getWindow(){
    return this.getIFrameStage().getIframeInnerWindow();
  },

  getDocument(){
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
