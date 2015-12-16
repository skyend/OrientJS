import IFrameStage from '../partComponents/IFrameStage.jsx';
import _ from 'underscore';
import React from 'react';
import FeedbackLayer from './DirectContext/FeedbackLayer.jsx';
import ElementSelectRect from './DirectContext/ElementSelectRect.jsx';
import ElementRemoteControl from './DirectContext/ElementRemoteControl.jsx';
import './DirectContext.less';
import Returns from "../../Returns.js";

let sharedElementCopyData = null;


var DirectContext = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],
  getDefaultProps(){
    return {
      renderStageWidth:720,
      renderStageHeight:480,
      renderStageMode:'tablet'
    };
  },

  getInitialState(){
    return {

      elementNavigatorX: 0,
      elementNavigatorY: 0,
      fixSelected: false,
      editModeElementNode: null,

      showElementNavigator: false,
      showElementMiniOptionSet:true,
      showElementRemoteControl:false,
      sizing: 'desktop'
    };
  },

  goingToContextStop(){
    if (this.state.showElementNavigator) {
      this.closeElementNavigator();
    }

    this.contextController.pause();
  },

  goingToContextRunning(){
    this.contextController.resume();

    this.emit("DocumentFocused", {
      document: this.contextController.document
    });
  },

  feedSaveStateChange(){
    this.emit("ChangedSaveState");
  },

  appendElementToBody(_element){
    return this.getIFrameStage().insertElementToInLastBySelector('body', _element);
  },

  isDropableToRoot(_domElement){

    // 해당 ContextController에 메소드로 확인.
    return this.getContextControllerFromDOMElement(_domElement).isDropableToRoot();
  },

  deployComponentToInLast(_vid, _component){
    if( this.state.editModeElementNode !== null ) return this.errorNotice('컴포넌트 드롭 실패', '요소 Text를 편집중입니다.');

    var returns;

    var dropTargetDOMElement = this.getIFrameStage().getElementByVid(_vid);

    if ( dropTargetDOMElement.___en !== undefined) {

      var baseElementNode = dropTargetDOMElement.___en;

      returns = baseElementNode.isDropableComponent("appendChild");

      if (returns.result === true) {

        this.props.contextController.modifyElementTree(baseElementNode, "appendComponent", _component);

      } else {
        this.noticeFailureReturns(returns);
      }
    } else {
      this.props.contextController.modifyElementTree(null, "appendComponent", _component);
    }
  },

  deployComponentToBefore(_vid, _component){
    if( this.state.editModeElementNode !== null ) return this.errorNotice('컴포넌트 드롭 실패', '요소 Text를 편집중입니다.');

    var dropTargetDOMElement = this.getIFrameStage().getElementByVid(_vid);

    if ( dropTargetDOMElement.___en !== undefined) {

      var baseElementNode = dropTargetDOMElement.___en;

      var returns = baseElementNode.isDropableComponent("appendChild");

      if (returns.result === true) {

        this.props.contextController.modifyElementTree(baseElementNode, "insertBeforeComponent", _component);
      } else {
        this.noticeFailureReturns(returns);
      }
    } else {
      console.error("배치할 수 없습니다.");
    }
  },

  deployComponentToAfter(_vid, _component){
    if( this.state.editModeElementNode !== null ) return this.errorNotice('컴포넌트 드롭 실패', '요소 Text를 편집중입니다.');

    var dropTargetDOMElement = this.getIFrameStage().getElementByVid(_vid);

    if ( dropTargetDOMElement.___en !== undefined) {

      var baseElementNode = dropTargetDOMElement.___en;

      var returns = baseElementNode.isDropableComponent("appendChild");

      if (returns.result === true) {
        this.props.contextController.modifyElementTree(baseElementNode, "insertAfterComponent", _component);
      } else {
        this.noticeFailureReturns(returns);
      }
    } else {
      console.error("배치할 수 없습니다.");
    }
  },

  noticeFailureReturns(_returns){
    switch (_returns.reasonCode) {
      case "has_not_parent":
        this.errorNotice("컴포넌트 배치 실패", "배치가능한 부모가 없습니다.");
        break;

      case "is_ghost":
        this.errorNotice("컴포넌트 배치 실패", "Ghost 요소에는 컴포넌트 배치가 불가능 합니다. Ghost의 원본 요소에 배치하여 주세요.");
        break;
    }
  },

  // will Deprecate
  // /***********
  //  * getContextControllerByElementNode
  //  * 입력된 ElementNode를 통해 ContextController 를 가져온다.
  //  * 이것은 PageContextController에 의해 DocumentContextController가 생성되어 동작중일 때
  //  * 대상요소의 해당 DocumentContextController를 참조하여. document데이터에 반영하기 위해서이다.
  //  * 이것으로 Document의 Document참조 Page의 Document참조 구조에서 서로 독립적으로 동작하여 서로의 데이터를 스스로 갱신하게 하여 수월한 관리가 가능하며.
  //  * 참조중인 하나이상의 Document를 하나의 IframeStage에서 편집할 수 있게 해준다.
  //  *
  //  * @Param _elementNode : ElementNode // 찾고자 하는 ContextController에서 사용되는 ElementNode
  //  * @Return DocumentContextController : DocumentContextController
  //  */
  //   getContextControllerByElementNode(_elementNode){
  //   return _elementNode.getMyContextControllerOfDocument();
  // },

  /**************
   * getContextControllerFromDOMElement
   * DOMElement를 이용하여 ContextController를 찾는다 하지만 지정된 DOMElement로 찾지 못할 경우 부모노드로 내려가 찾고
   * 그래도 찾지 못할 경우에는 directContext에 지정된 ContextController를 반환한다.
   */
  getContextControllerFromDOMElement(_sourceDOMElement){
    var fountElementNode = false;
    var dropTarget = _sourceDOMElement;

    // function을 찾으면 루프탈출
    while (dropTarget !== null) {
      if (dropTarget.___en !== undefined) {
        fountElementNode = true;
        break;
      }

      dropTarget = dropTarget.parentNode;
    }

    // will Deprecate
    // // ___en 필드를 가진 Element를 찾았다면 해당 엘리먼트를 통해 ContextController 를 얻고
    // // 찾지 못했다면 DirectContext의 최상위 contextController인 this.contextController를 contextController로 사용한다.
    // if (fountElementNode) {
    //   return this.getContextControllerByElementNode(dropTarget.___en);
    // }

    return this.contextController;
  },

  failToDrop(){
    this.errorNotice(
      "해당 컴포넌트를 삽입 할 수 없습니다.",
      "드랍하고자 하는 ElementNode에는 해당 컴포넌트를 허용하지 않습니다."
    );

    this.errorNotice(
      "component 삽입실패",
      "영역을 확인하여 주세요. 최초에 RootWrapper를 삽입하시는것을 권장합니다."
    );

  },

  copyElementJSON(){
    // elementNode를 copy 할 때에는 ID를 제외하고 copy한다.
    // 타 Document에 붙여넣기되었을 때 ID충돌을 방지하기 위함이다.
    // 타 Document에 붙여넣기 될 때 ID가 비어 있으면 자동으로 새로 부여하게 될 것이다.
    var data = this.state.selectedElementNode.export(true);

    sharedElementCopyData = data;

    this.infoNotice("복사 성공", this.state.selectedElementNode.getId() + " ElementNode 가 성공적으로 복사되었습니다.")
  },

  pasteElementIn(){
    if( this.state.editModeElementNode !== null ) return this.errorNotice('붙여넣기 실패', '요소 Text를 편집중입니다.');

    if (sharedElementCopyData === null) {
      this.errorNotice('붙여넣기 실패', '이전에 복사된 내용이 없습니다.');
      return;
    }

    var elementNode = this.state.selectedElementNode;

    this.props.contextController.modifyElementTree(elementNode.id, 'pasteIn', sharedElementCopyData);
  },

  removeElement(){
    if( this.state.editModeElementNode !== null ) return this.errorNotice('요소 제거 실패', '요소 Text를 편집중입니다.');

    let elementNode = this.state.selectedElementNode;

    this.props.contextController.modifyElementTree(elementNode.id, 'remove');

    this.setState({showElementNavigator: false});
  },

  cloneElement(){
    if( this.state.editModeElementNode !== null ) return this.errorNotice('복제 실패', '요소 Text를 편집중입니다.');

    var elementNode = this.state.selectedElementNode;
    var contextController = this.getContextControllerFromDOMElement(elementNode.getRealization());

    contextController.modifyElementTree(elementNode, "cloneAndInsertAfter");
  },

  editElement(){
    // select 된 요소를 변경한다.

    let targetElementNode = this.state.selectedElementNode;

    if( this.state.selectedElementNode.type === 'string' ){
      targetElementNode = targetElementNode.getParent();

      this.selectElement(targetElementNode.getRealization());
    }

    this.toggleTextEditMode(targetElementNode);
  },

  jumpToParentElement(){
    if( this.state.editModeElementNode !== null ) return this.errorNotice('부모 점프 실패', '요소 Text를 편집중입니다.');

    var parent = this.state.selectedElementNode.getParent();

    if (parent === null) {
      this.errorNotice(
        "상위 노드로 점프 실패.",
        "더이상 상위노드가 존재하지 않습니다."
      );
      return;
    }

    var parentRealDOMElement = parent.getRealization();

    this.selectElement(parentRealDOMElement, parentRealDOMElement.getBoundingClientRect());
  },

  useElementRemoteControl(){
    this.setState({showElementRemoteControl:true, showElementMiniOptionSet:false});
  },

  closeElementNavigator(){
    if( this.state.editModeElementNode !== null ) return this.errorNotice('네비게이터를 닫을 수 없음', '요소 Text를 편집중입니다.');

    this.setState({
      showElementNavigator: false,
      selectedElement: null
    });


    this.emit("CancelSelectElementNode");
  },

  showElementNavigator(_elementNode){

    if (_elementNode.isGhost) {
      this.errorNotice("요소 선택 불가", "고스트 요소는 선택이 불가능합니다. 반복자로 지정된 요소를 이용하세요.");
      return;
    } else {
      this.emit("SuccessfullyElementNodeSelected", {
        elementNode: _elementNode,
        contextController: this.props.contextController
      });
    }

    var target = _elementNode.getRealization();

    var boundingRect;
    if (target.nodeName === '#text') {

      if (target.nodeValue === '') {

        boundingRect = {left: 0, top: 0, width: 0, height: 0};

        this.errorNotice(
          "영역을 확인할 수 없습니다.",
          "String Type Element의 영역을 확인하기 위해서는 하나이상의 문자를 가지고 있어야합니다."
        );
      } else {

        var range = document.createRange();
        range.selectNodeContents(target);
        boundingRect = range.getClientRects()[0];
      }
    } else {
      boundingRect = target.getBoundingClientRect();
    }

    this.setState({
      showElementNavigator: true,
      selectedElementNode: _elementNode
    });
  },

  repositionElementNavigator(){
    if (this.state.showElementNavigator) {
      var elementNaviDOM = this.refs['element-navigator'].getDOMNode();

      var elementNaviDOMRight = elementNaviDOM.offsetLeft + elementNaviDOM.offsetWidth;
      if (this.props.width < elementNaviDOMRight) {
        this.setState({elementNavigatorX: this.props.width - elementNaviDOM.offsetWidth});
      }
    }

  },

  selectElement(_targetNode){
    if( this.state.editModeElementNode !== null ) return ;

    // 현재 선택된 Element에 ___en 필드가 있는지 확인한 후 없으면 path를 타고 ___en 필드가 있는 Element를 찾는다.
    // 찾은 후 해당 Element로 selectElement메소드를 다시 호출한다.
    var targetNode = _targetNode;


    // target 에 ___en 필드가 존재하는지 확인하고 없다면 target을 이전의 target의 부모로 상승시킨다.
    while ( targetNode.___en === undefined ) {
      if (targetNode.parentElement === null) break;
      targetNode = targetNode.parentElement;
    }

    // target 변수가 가르키는 element에 ___en 필드가 존재하지 않는다면.
    if (targetNode.___en === undefined) {

      this.errorNotice(
        "매핑된 ElementNode 를 얻을 수 없습니다.",
        "ElementNode를 배치하여 주세요."
      );

      return;
    }

    var elementNode = targetNode.___en;

    // if( elementNode.isGhost ){
    //   this.errorNotice("요소 선택 불가","반복되거나 고스트 요소는 선택이 불가능합니다. 반복자로 지정된 요소를 이용하세요.");
    //   return;
    // }

    this.emit("SelectElementNode", {
      elementNode: elementNode
    });
  },

  addStyle(_key, _css){
    //this.getIFrameStage().addStyle( _key, _css );
  },

  applyStyleElement(_element){
    this.getIFrameStage().appendStyleElement(_element);
  },

  applyScriptElement(_element){
    this.getIFrameStage().appendScriptElementToHead(_element);
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

  getIFrameStageScrollX(){
    return this.getIFrameStage().getScrollX();
  },

  getIFrameStageScrollY(){
    return this.getIFrameStage().getScrollY();
  },

  getIFrameStage(){
    return this.refs['iframe-stage'];
  },

  toggleTextEditMode(_elementNode){
    let self = this;
    if( this.state.editModeElementNode !== null ){
      // 편집모드 종료

      this.props.contextController.leaveTextEditMode(this.state.editModeElementNode);

      this.setState({fixSelected: false, editModeElementNode:null});

      this.emit("ChangeContextControllerState");
    } else {
      // 편집모드 시작

      this.props.contextController.enterTextEditMode(_elementNode/*, function(_data){
          self.forceUpdate();
      }*/);

      this.setState({fixSelected: true, editModeElementNode:_elementNode});

      this.emit("ChangeContextControllerState");

    }

    // 다시 랜더링된 직후는 선택된 요소의 Size가 제대로 가져와지지 않아 0.1초후에 다시 업데이트를 하여 Size를 반영하기 위해
    setTimeout(function(){
      self.forceUpdate();
    }, 100);
  },

  onThrowCatcherReturnMiniOption(){
    this.setState({showElementRemoteControl:false, showElementMiniOptionSet:true});
  },

  onThrowCatcherJumpToParent(){
    this.jumpToParentElement();
  },

  onThrowCatcherEdit(){
    this.editElement();
  },

  onThrowCatcherClone(){
    this.cloneElement();
  },

  onThrowCatcherCopyData(){
    this.copyElementJSON();
  },

  onThrowCatcherPasteIn(){
    this.pasteElementIn();
  },

  onThrowCatcherRemove(){
    this.removeElement();
  },

  onThrowCatcherReturnSelect(){
    this.closeElementNavigator();
  },

  onThrowCatcherScrollAtStage(_eventData, _pass){
    this.forceUpdate();

  },

  onThrowCatcherDClickElementInStage(_eventData){
    this.editElement();
  },

  onThrowCatcherClickElementInStage(_eventData, _pass) {

    this.selectElement(_eventData.targetDOMNode, _eventData.boundingRect);

    // BuilderSService가 contextMenu를 닫을 수 있도록 pass 한다.
    _pass();
  },

  onThrowCatcherElementResizingStart(_eventData){
    this.setState({selectedElementResizg: true});
  },

  onThrowCatcherElementResizing(_eventData){
    var elNode = this.state.selectedElementNode;
    var stageBound = this.getIFrameStageBoundingRect();
    var elNodeBound = elNode.getBoundingRect();
    var computedStyle = this.getWindow().getComputedStyle(elNode.getRealization());

    var mouseXonStage = _eventData.pageX - stageBound.left;
    var mouseYonStage = _eventData.pageY - stageBound.top;

    var nextWidth = undefined;// = mouseXonStage - elNodeBound.left;
    var nextHeight = undefined;// = mouseYonStage - elNodeBound.top;
    var nextLeft = undefined;
    var nextTop = undefined;

    if (_eventData.pointHor === 'right') {
      nextWidth = mouseXonStage - elNodeBound.left;
    } else if (_eventData.pointHor === 'left') {
      nextLeft = mouseXonStage;
      nextWidth = elNodeBound.right - nextLeft;
    }

    if (_eventData.pointVer === 'bottom') {
      nextHeight = mouseYonStage - elNodeBound.top;
    } else if (_eventData.pointVer === 'top') {
      nextTop = mouseYonStage;
      nextHeight = elNodeBound.bottom - nextTop;
    }


    // boxSizing에 따라 padding과 border의 넓이를 제외한다.
    switch (computedStyle.boxSizing) {
      case "content-box":
        nextWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        nextHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);

      case "padding-box":
        nextWidth -= parseFloat(computedStyle.borderLeftWidth) + parseFloat(computedStyle.borderRightWidth);
        nextHeight -= parseFloat(computedStyle.borderBottomWidth) + parseFloat(computedStyle.borderTopWidth);
        break;
    }

    // 0미만방지
    if (nextWidth < 0) nextWidth = 0;
    if (nextHeight < 0) nextHeight = 0;


    this.props.contextController.modifyElementProperty(elNode, "rectangle", {
      left: nextLeft,
      top: nextTop,
      width: nextWidth,
      height: nextHeight
    });

    //elNode.document.getContextController().rootRender();
    this.forceUpdate();
  },

  onThrowCatcherElementResizingEnd(_eventData){
    var elNode = this.state.selectedElementNode;
    this.setState({selectedElementResizg: false});
    // 랜더링
    //elNode.document.getContextController().rootRender();
  },


  // 더블클릭으로 요소 편집은 추후에 정책을 정확이 한 후 개발
  // 리졸브동기화 문제가 있음
  // onThrowCatcherDClickElementInStage(_eventData, _pass) {
  //   _eventData.targetDOMNode.setAttribute('contenteditable', true);
  //   this.selectElement( _eventData.targetDOMNode, _eventData.boundingRect );
  // },

  // 히스토리 변경알림
  updatedHistory(){
    this.emitRefreshDirectContext();
  },

  // DirectContext에서 랜더링중인 Document와 ElementNode의 속성이 변경되었음을 알려 Tool의 필드를 갱신하게 한다.
  emitRefreshDirectContext(){
    this.emit("RefreshedDirectContext");
  },

  getContextType(){
    return this.props.contextType;
  },

  isAcceptDropComponent(){
    var contextType = this.getContextType();
    if (contextType === 'document' || contextType === 'page') {
      return true;
    }

    return false;
  },


  save(){
    this.props.contextController.save();
  },

  infoNotice(_title, _message){
    this.emit('NoticeMessage', {
      title: _title,
      message: _message,
      level: "info"
    });
  },

  errorNotice(_title, _message){
    this.emit('NoticeMessage', {
      title: _title,
      message: _message,
      level: "error"
    });
  },

  iframeStageTransitionEnd(){
    // transition완료후의 달라진 요소의 Rect를 추적하기 위해 최종 업데이트
    this.forceUpdate();
  },


  componentWillUpdate(_nextProps, _nextState){
    if (_nextProps.renderStageMode !== this.props.contextController.getScreenSizing()) {
      this.mustRedrawStage = true;
    }

    // contextController 의 디스플레이모드를 변경한다.
    this.props.contextController.setScreenSizing(_nextProps.renderStageMode);
  },

  componentDidUpdate(){
    this.scrollX = this.getIFrameStageScrollX();
    this.scrollY = this.getIFrameStageScrollY();

    if (this.mustRedrawStage) {
      this.props.contextController.rootRender();
      this.mustRedrawStage = false;
    }

    //this.repositionElementNavigator();

    if (this.props.runningState === this.props.contextController.running) return;


    if (this.props.runningState) {
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }

  },

  componentDidMount(){
    this.scrollX = this.getIFrameStageScrollX();
    this.scrollY = this.getIFrameStageScrollY();

    // contextController 연결
    this.contextController = this.props.contextController;
    this.contextController.attach(this, this.getDocument().body);

    if (this.props.runningState) {
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }

    // iframe stage 의 Transition이 끝난 시점에 호출한다.
    this.refs['iframe-stage'].getDOMNode().addEventListener("transitionend", this.iframeStageTransitionEnd, true);
  },

  render(){
    var iframeStageWidth = (this.props.renderStageWidth > this.props.width) ? this.props.width : this.props.renderStageWidth;
    var iframeStageHeight = (this.props.renderStageHeight > this.props.height) ? this.props.height : this.props.renderStageHeight;
    iframeStageWidth -= 10;
    iframeStageHeight -= 10;
    var stageX = ( this.props.width - iframeStageWidth ) / 2;
    var stageY = ( this.props.height - iframeStageHeight ) / 2;
    this.stageX = stageX;
    this.stageY = stageY;

    var style = {
      width: this.props.width,
      height: this.props.height
    };


    if (this.props.runningState) {
      style.opacity = 1;
    } else {
      style.opacity = 0;
      style.pointerEvents = 'none';
    }

    var elementNavigatorStyle = {};
    var selectedSelectRect = {};
    var selectedElementResizable = false;
    var elementNavigatorClasses = ['element-navigator'];
    if (!this.state.showElementNavigator) {
      elementNavigatorClasses.push('off');

      var elNavY = this.state.prevElementNavigatorY - 50;
      if (elNavY < 0) {
        elNavY = 0;
      }

      elementNavigatorStyle = this.prevElNavStyle || {};
      elementNavigatorStyle.top += 50;

      selectedSelectRect = this.prevSelectedSelectRect || {};

    } else {
      var elementNode = this.state.selectedElementNode;
      var boundingBox = elementNode.getBoundingRect();

      var elNavY = boundingBox.top - 50 + stageY;
      if (elNavY < 0) {
        elNavY = 0;
      }

      var elNavX = boundingBox.left + stageX;
      if (elNavX + 300 > this.props.width) {
        elNavX = this.props.width - 300;
      }

      elementNavigatorStyle = {
        left: elNavX,
        top: elNavY
      };

      selectedSelectRect = {
        width: boundingBox.width,
        height: boundingBox.height,
        left: boundingBox.left + stageX,
        top: boundingBox.top + stageY
      };

      this.prevElNavStyle = elementNavigatorStyle;
      this.prevSelectedSelectRect = selectedSelectRect;

      if (elementNode.getType() !== 'string') {
        selectedElementResizable = true;
      }

      var elementSizeInfo;
      if (this.state.selectedElementResizg) {
        var rectangle = elementNode.getCurrentRectangle();

        elementSizeInfo = (
          <div className='element-size-rect'>
            <div className='size'>
              {(rectangle.width || 'auto') + ' x ' + (rectangle.height || 'auto')}
            </div>
          </div>
        )
      }


      if( !this.state.showElementMiniOptionSet ){
        elementNavigatorClasses.push('off');
      }
    }


    /******
     * DirectContext와 Iframe-stage의 ContentBox 는 일치하여야 한다.
     *
     *
     */
    return (
      <div className='DirectContext theme-white' style={style}>
        <FeedbackLayer width={iframeStageWidth} height={iframeStageHeight} left={ stageX } top={ stageY }/>
        <IFrameStage ref='iframe-stage' width={iframeStageWidth} height={iframeStageHeight} left={ stageX }
                     top={ stageY }/>

        <div className={elementNavigatorClasses.join(' ')} ref='element-navigator'
             style={elementNavigatorStyle}>
          {elementSizeInfo}

          <div className='box'>
            <ul>

              <li>
                <button onClick={this.jumpToParentElement}>
                  <i className='fa fa-bolt'/> <span
                  className='title'><span>Jump to Parent</span></span>
                </button>
              </li>

              <li>
                <button onClick={this.editElement}>
                  <i className='fa fa-pencil-square-o'/> <span className='title'>Edit</span>
                </button>
              </li>

              <li>
                <button onClick={this.cloneElement}>
                  <i className='fa fa-clone'/> <span className='title'>Clone & insert Next</span>
                </button>
              </li>

              <li>
                <button onClick={this.copyElementJSON}>
                  <i className='fa fa-clipboard'/> <span className='title'>Copy Data</span>
                </button>
              </li>

              <li>
                <button onClick={this.pasteElementIn}>
                  <i className='fa fa-pencil-square'/> <span className='title'>Paste In</span>
                </button>
              </li>

              <li>
                <button onClick={this.removeElement}>
                  <i className='fa fa-trash'/> <span className='title'>Remove</span>
                </button>
              </li>

              <li>
                <button onClick={this.useElementRemoteControl}>
                  <i className='fa fa-share-square-o'/> <span className='title'>Change RemoteControl</span>
                </button>
              </li>

              <li>
                <button onClick={this.closeElementNavigator}>
                  <i className='fa fa-times'/> <span className='title'>Close</span>
                </button>
              </li>

            </ul>
          </div>
        </div>


        <ElementSelectRect left={selectedSelectRect.left}
                           top={selectedSelectRect.top}
                           width={selectedSelectRect.width}
                           height={selectedSelectRect.height}
                           active={this.state.showElementNavigator}
                           resizable={selectedElementResizable}
                           editModeHighlight={this.state.editModeElementNode !== null }/>

        {this.state.showElementRemoteControl && this.state.showElementNavigator? <ElementRemoteControl defaultLeft={stageX + (iframeStageWidth/2)} defaultTop={stageY + (iframeStageHeight/3)}/>:''}
      </div>

    );
  }
});

export default DirectContext;
