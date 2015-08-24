var IFrameStage = require('./partComponents/IFrameStage.jsx');
var _ = require('underscore');
var React = require('react');
require('./DirectContext.less');

var DirectContext = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      elementNavigatorX: 0,
      elementNavigatorY: 0,
      showElementNavigator: false
    };
  },

  appendElementToBody( _element ){
    return this.getIFrameStage().insertElementToInLastBySelector('body', _element);
  },

  isDropableToRoot( _domElement ){
    
    // 해당 ContextController에 메소드로 확인.
    return this.getContextControllerFromDOMElement(_domElement).isDropableToRoot();
  },


  deployComponentToInLast( _vid, _component ){
    console.log("deployed component", _component);

    var dropTarget = this.getIFrameStage().getElementByVid(_vid);

    var contextController = this.getContextControllerFromDOMElement(dropTarget);

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

  /**************
   * getContextControllerFromDOMElement
   * DOMElement를 이용하여 ContextController를 찾는다 하지만 지정된 DOMElement로 찾지 못할 경우 부모노드로 내려가 찾고
   * 그래도 찾지 못할 경우에는 directContext에 지정된 ContextController를 반환한다.
   */
  getContextControllerFromDOMElement(_sourceDOMElement){
    var funcFind = false;
    var dropTarget = _sourceDOMElement;

    // function을 찾으면 루프탈출
    while( dropTarget !== null ){
      if( typeof dropTarget.getElementNode === 'function' ){
        funcFind = true;
        break;
      }

      dropTarget = dropTarget.parentNode;
    }


    // getElementNode 메소드를 가진 Element를 찾았다면 해당 엘리먼트를 통해 ContextController 를 얻고
    // 찾지 못했다면 DirectContext의 최상위 contextController인 this.contextController를 contextController로 사용한다.
    if( funcFind ){
      return this.getContextControllerByElementNode(dropTarget.getElementNode());
    }

    return this.contextController;
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

  removeElement(){

  },

  editElement(){

  },

  jumpToParentElement(){
    var nextParent = this.state.selectedElementPath[1];
    if( nextParent === undefined ){
      return;
    }

    if( typeof nextParent.getElementNode !== 'function' ){
      return;
    }

    this.state.selectedElementPath.shift();

    this.selectElement( this.state.selectedElementPath[0], this.state.selectedElementPath );
  },

  closeElementNavigator(){

    this.setState({
      showElementNavigator:false,
      elementNavigatorX:0,
      elementNavigatorY:0,
      elementNavigatorWidth:0,
      elementNavigatorHeight:0,
      selectedElement:null,
      selectedElementPath:null});
  },

  selectElement( _target, _path){

    // 현재 선택된 Element에 getElementNode메소드가 있는지 확인한 후 없으면 path를 타고 getElementNode메소드가 있는 Element를 찾는다.
    // 찾은 후 해당 Element로 selectElement메소드를 다시 호출한다.
    if( typeof _target.getElementNode !== 'function' ){
      for( var i = 0; i < _path.length; i++ ){
        if( typeof _path[i].getElementNode === 'function' ){
          this.selectElement( _path[i], _path.slice(i, _path.length -1) );
          return;
        }
      }

      this.emit('NoticeMessage',{
        title:"매핑된 ElementNode 를 얻을 수 없습니다.",
        message:"ElementNode를 배치하여 주세요.",
        level : "error"
      });

      return;
    }


    var targetRect = _target.getBoundingClientRect();

    this.setState({
      showElementNavigator:true,
      elementNavigatorX:targetRect.left,
      elementNavigatorY:targetRect.top,
      elementNavigatorWidth:targetRect.width,
      elementNavigatorHeight:targetRect.height,
      selectedElement:_target,
      selectedElementPath:_path});

    // DisplayElementPath 이벤트를 발생시키기 위해 path의 순서를 뒤집는다.
    var reversePath = [];
    for(var i =0; i < _path.length; i++ ){
      reversePath.push( _path[i] );
    }


    this.emit("DisplayElementPath",{
      elementPathArray: reversePath
    });

    this.emit("SelectedElementNodeByDirectContext",{
      elementNode: _target.getElementNode()
    });
  },

  onThrowCatcherScrollAtStage(_eventData, _pass){
    this.closeElementNavigator();
  },

  onThrowCatcherClickElementInStage(_eventData, _pass) {
    this.selectElement( _eventData.targetDOMElement, _eventData.elementPath);

    // BuilderSService가 contextMenu를 닫을 수 있도록 pass 한다.
    _pass();
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

    var elNavY = this.state.elementNavigatorY - 35;
    if( elNavY < 0 ){
      elNavY = 0;
    }

    var elementNavigatorStyle = {
      left:this.state.elementNavigatorX,
      top: elNavY,
      display: this.state.showElementNavigator? 'inherit':'none'
    };

    var selectedOutlineStyleTop = {
      left:this.state.elementNavigatorX,
      top: this.state.elementNavigatorY - 3,
      width:this.state.elementNavigatorWidth,
      height:3,
      display: this.state.showElementNavigator? 'inherit':'none'
    }

    var selectedOutlineStyleBottom = {
      left:this.state.elementNavigatorX,
      top: this.state.elementNavigatorY + this.state.elementNavigatorHeight,
      width:this.state.elementNavigatorWidth,
      height:3,
      display: this.state.showElementNavigator? 'inherit':'none'
    }

    var selectedOutlineStyleLeft = {
      left:this.state.elementNavigatorX-3,
      top: this.state.elementNavigatorY-3,
      width:3,
      height:this.state.elementNavigatorHeight + 6,
      display: this.state.showElementNavigator? 'inherit':'none'
    }

    var selectedOutlineStyleRight = {
      left:this.state.elementNavigatorX + this.state.elementNavigatorWidth,
      top: this.state.elementNavigatorY-3,
      width:3,
      height:this.state.elementNavigatorHeight+6,
      display: this.state.showElementNavigator? 'inherit':'none'
    }

    /******
     * DirectContext와 Iframe-stage의 ContentBox 는 일치하여야 한다.
     *
     *
     */
    return (
      <div className='DirectContext theme-black' style={style}>
        <IFrameStage ref='iframe-stage' width={this.props.width} height={this.props.height}/>
         <div className='element-navigator' ref='element-navigator' style={elementNavigatorStyle}>
           <div className='box'>
             <ul>
              <li>
                <button onClick={this.jumpToParentElement}>
                  <i className='fa fa-bolt'/> Parent
                </button>
              </li>
              <li>
                <button onClick={this.editElement}>
                  <i className='fa fa-pencil-square-o'/> Edit
                </button>
              </li>
              <li>
                <button onClick={this.removeElement}>
                  <i className='fa fa-trash'/> Remove
                </button>
              </li>
              <li>
                <button onClick={this.closeElementNavigator}>
                  <i className='fa fa-times'/>
                </button>
              </li>
             </ul>
           </div>
         </div>
         <div className='selected-element-outline' style={selectedOutlineStyleTop}/>
         <div className='selected-element-outline' style={selectedOutlineStyleBottom}/>
         <div className='selected-element-outline' style={selectedOutlineStyleLeft}/>
         <div className='selected-element-outline' style={selectedOutlineStyleRight}/>
      </div>

    );
  }
});


module.exports = DirectContext;
