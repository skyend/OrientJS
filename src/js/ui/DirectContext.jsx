var IFrameStage = require('./partComponents/IFrameStage.jsx');
var React = require('react');

var DirectContext = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  appendElementToBody( _element ){
    return this.getIFrameStage().insertElementToInLastBySelector('body', _element);
  },

  isDropableToRoot( _domElement ){
    var dropTarget = _domElement;

    var contextController = this.getContextControllerByElementNode(dropTarget.getElementNode());

    return contextController.isDropableToRoot();
  },

  deployComponentToInLast( _vid, _component ){
    console.log("deployed component", _component);

    var dropTarget = this.getIFrameStage().getElementByVid(_vid);

    var contextController = this.getContextControllerByElementNode(dropTarget.getElementNode());

    var result = contextController.insertNewElementNodeFromComponent('appendChild',_component, dropTarget);

    if( ! result ) {
      this.failToDrop();
    }

    //return this.getIFrameStage().insertElementToInLastByVid(_vid, _staticElement);
  },

  deployComponentToBefore( _vid, _component ){
    var dropTarget = this.getIFrameStage().getElementByVid(_vid);
    var contextController = this.getContextControllerByElementNode(dropTarget.getElementNode());

    var result = contextController.insertNewElementNodeFromComponent('insertBefore',_component, dropTarget);
    if( ! result ) {
      this.failToDrop();
    }
    // console.log("deployed component", _component);
    // return this.getIFrameStage().insertElementToBeforeByVid(_vid, _staticElement);
  },

  deployComponentToAfter( _vid, _component ){
    var dropTarget = this.getIFrameStage().getElementByVid(_vid);
    var contextController = this.getContextControllerByElementNode(dropTarget.getElementNode());

    var result = contextController.insertNewElementNodeFromComponent('insertAfter',_component, dropTarget);
    if( ! result ) {
      this.failToDrop();
    }
    // console.log("deployed component", _component);
    // return this.getIFrameStage().insertElementToAfterByVid(_vid, _staticElement);
  },

  /***********
   * getContextControllerByElementNode
   * 입력된 ElementNode를 통해 ContextController 를 가져온다.
   * 이것은 PageContextController에 의해 DocumentContextController가 생성되어 동작중일 때
   * 대상요소의 해당 DocumentContextController를 참조하여. document데이터에 반영하기 위해서이다.
   * 이것으로 Document의 Document참조 Page의 Document참조 구조에서 서로 독립적으로 동작하여 서로의 데이터를 스스로 갱신하게 하여 수월한 관리가 가능하며.
   * 참조중인 하나이상의 Document를 하나의 IframeStage에서 편집할 수 있게 해준다.
   *
   * @Param _elementNode : ElementNode // 찾고자 하는 ContextController에서 사용되는 ElementNode
   * @Return DocumentContextController : DocumentContextController
   */
  getContextControllerByElementNode( _elementNode ){
    return _elementNode.getMyContextControllerOfDocument();
  },

  failToDrop(){
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
