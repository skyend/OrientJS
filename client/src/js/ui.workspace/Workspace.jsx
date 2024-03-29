/**
 * Screen.jsx
 * 빌더의 전체적인 UI를 포함하고 컨트롤 하는 클래스
 *
 * Requires(js)  : BuilderNavigation.jsx
 * Requires(css) : Screen.less
 */

import './Workspace.less';

import _ from 'underscore';
import Async from '../lib/Async.js';
import HeadToolBar from'./HeadToolBar.jsx'; //상단 네비게이션 UI
import ToolNavigation from './ToolNavigation.jsx';

import ContextStage from './ContextStage.jsx'; //중앙 컨텐츠 영역 UI
import FootStatusBar from './FootStatusBar.jsx'; //하단 상태 표시줄 UI
import Modal from './Modal.jsx'; //Modal UI
import FloatingMenuBox from './FloatingMenuBox.jsx'; //StageContextMenu
import NotificationSystem from './NotificationSystem.jsx'; //PushMessage
import SubWindowSystem from './SubWindowSystem/SubWindowSystem.jsx';
import ResourceUploadArea from './ResourceUploadArea.jsx';

import React from 'react';
import cookie from 'js-cookie';
import EventDistributor from './reactMixin/EventDistributor.js';

/**
 * UIService
 *
 */
var Workspace = React.createClass({

  // Mixin EventDistributor
  mixins: [EventDistributor],


  getInitialState() {
    return {toolStatesStore: {}};
  },


  onThrowCatcherCallContextMenu(_eventData, _pass) {
    this.emit("RootTest", _eventData);
    if (_eventData.for === "StageElement") {
      //console.log(_eventData);

      this.refs['stage-context-menu'].setState({
        display: 'on',
        x: _eventData.mouseX,
        y: _eventData.mouseY,
        for: _eventData.for,
        target: _eventData.target,

        memuItems: [
          // {
          //     title: "Delete",
          //     type: "button",
          //     key: "elementDelete",
          //     eventName: "StageElementDelete"
          // }, {
          //     title: "Clone",
          //     type: "button",
          //     key: "elementClone",
          //     eventName: "StageElementClone"
          // }, {
          //     title: "Edit",
          //     type: "button",
          //     key: "elementEdit",
          //     eventName: "StageElementEdit"
          // },
          {
            title: "Edit Document CSS",
            type: "button",
            key: "editDocumentCSS",
            eventName: "EditDocumentCSS"
          }, {
            title: "Stage Fullscreen",
            type: "button",
            key: "newSubwindowTest",
            eventName: "NewSubWindow_Test"
          }, {
            title: "Popup Modal(Test)",
            type: "button",
            key: "popupModalTest",
            eventName: "PopupModal_Test"
          }, {
            title: "Push Message(Test)",
            type: "button",
            key: "pushMessageTest",
            eventName: "PushMessage_Test"
          },
          "spliter",
          {
            title: "Open Bottom Tools",
            type: "button",
            key: "open-bot-tools",
            eventName: "OpenBottomTools"
          }
        ]
      });
    }
    //_pass();
  },

  onThrowCatcherClickElementInStage(_eventData, _pass) {
    this.offContextMenu();
  },

  onThrowCatcherStageElementDelete(_eventData, _pass) {
    //_eventData.target.element.remove();

    this.refs['ContextStage'].deleteElement({
      contextId: _eventData.target.contextId,
      elementId: _eventData.target.elementId
    });


    this.offContextMenu();
  },

  onThrowCatcherStageElementClone(_eventData, _pass) {
    this.offContextMenu();
    this.refs['ContextStage'].setState({a: 1});
  },

  onThrowCatcherStageElementEdit(_eventData, _pass) {
    this.offContextMenu();
  },

  onThrowCatcherEditDocumentCSS(_eventData, _pass) {
    this.offContextMenu();

    this.emit('RequestAttachTool', {
      where: "SubWindow",
      toolKey: "DocumentConfig"
    });
  },

  onThrowCatcherPopupModal_Test(_eventData, _pass){
    this.offContextMenu();
  },

  onThrowCatcherPushMessage_Test(_eventData, _pass){
    this.offContextMenu();
  },

  onThrowCatcherOpenBottomTools(_eventData, _pass) {
    this.offContextMenu();
    this.refs['BottomNavigation'].setState({show: true});
  },

  onThrowCatcherFoldTool(_eventData, _pass) {
    console.log(_eventData);
    if (_eventData.refPath[0] === 'RightNavigation') {
      this.rightAreaWidth = _eventData.width;

    } else if (_eventData.refPath[0] === 'LeftNavigation') {
      this.leftAreaWidth = _eventData.width;
    }

    this.resizeSelf();
  },

  onThrowCatcherUnfoldTool(_eventData, _pass) {
    console.log(_eventData);
    if (_eventData.refPath[0] === 'RightNavigation') {
      this.rightAreaWidth = _eventData.width;
    } else if (_eventData.refPath[0] === 'LeftNavigation') {
      this.leftAreaWidth = _eventData.width;
    }

    this.resizeSelf();
  },

  onThrowCatcherSetToolFitToMax(_eventData, _pass){
    var ref = _eventData.myRef;

    if (ref === 'LeftNavigation') {
      this.refs["RightNavigation"].setState({toolWidthMode: 'auto'});
    } else if (ref === 'RightNavigation') {
      this.refs['LeftNavigation'].setState({toolWidthMode: 'auto'});
    }

  },

  onThrowCatcherDisplayElementPath(_eventData, _pass) {
    console.warn('recieve onThrowCatcherDisplayElementPath', _eventData);

    var footStatusBar = this.refs['FootStatusBar'];


    footStatusBar.setState({
      domElementPathArray: _eventData.pathArray
    });

  },

  onThrowCatcherExpectedDropToVNodePath(_eventData, _pass) {
    //console.log('recieve', _eventData);


  },

  onThrowCatcherNeedProjectMeta(_eventData, _pass){
    //console.log('NeedProjectMeta',this.state.projectMeta);

    _eventData.path[0].setState({'meta': this.state.projectMeta});
  },


  onThrowCatcherNoticeMessage(_eventData, _pass) {
    this.notifyMessage(_eventData.title, _eventData.message, _eventData.level);
  },


  onThrowCatcherFocusedContext(_eventData){
    this.noticeSelectedContextItemToTools(_eventData.contextItem);
  },

  onThrowCatcherUnfocusedContext(_eventData){
    this.noticeSelectedContextItemToTools(null);
    this.noticeSelectedElementToTools(null, null);
  },

  onThrowCatcherNewContext(_eventData){

  },

  onThrowCatcherClosedContext(_eventData){
    this.emit("DestroyContext", {
      context: _eventData.contextItem
    });

    this.noticeSelectedContextItemToTools(null);
  },


  onThrowCatcherDocumentFocused(_eventData, _pass){
    this.applyToolStates("DocumentConfig", {
      document: _eventData.document
    });

    this.applyToolStates("DocumentCSSEditor", {
      document: _eventData.document
    });
  },


  // // 열린 컨텍스트 탭
  // onThrowCatcherOpenedDirectContextTab(_eventData, _pass){
  //   //console.log(_eventData);
  //   console.log('컨텍스트가 열렸습니다.');
  //
  //   this.applyToolStates("ServiceResources", {
  //     runningContext: _eventData.contextItem
  //   });
  //
  //   this.applyToolStates("ContextContentsNavigation", {
  //     runningContext: _eventData.contextItem.contextType === 'document'? _eventData.contextItem:null
  //   });
  //
  //   this.applyToolStates("DocumentCSSEditor", {
  //     contextController: _eventData.contextItem.contextType === 'document'? _eventData.contextItem.contextController:null
  //   });
  //
  //   this.applyToolStates("APISourceMappingHelper", {
  //     contextController: _eventData.contextItem.contextType === 'document'? _eventData.contextItem.contextController:null
  //   });
  //
  //   this.refs['HeadToolBar'].setState({
  //     contextItem: _eventData.contextItem
  //   });
  // },
  //
  //
  // onThrowCatcherClosedDirectContextTab(_eventData, _pass){
  //   //console.log(_eventData);
  //   console.log('컨텍스트가 닫혔습니다.');
  //
  //   this.applyToolStates("ServiceResources", {
  //     runningContext: null
  //   });
  //
  //   this.applyToolStates("ContextContentsNavigation", {
  //     runningContext: null
  //   });
  //
  //   this.applyToolStates("DocumentCSSEditor", {
  //     contextController:null
  //   });
  //
  //   this.applyToolStates("APISourceMappingHelper", {
  //     contextController: null
  //   });
  //
  //   this.refs['HeadToolBar'].setState({
  //     contextItem: null
  //   });
  //
  //   this.emit("DestroyContext", {
  //     context: _eventData.contextItem
  //   });
  // },

  onThrowCatcherRefreshedDirectContext(){
    this.refs['HeadToolBar'].forceUpdate();
  },

  attachTool(_position, _attachOptions, _toolEgg){
    //console.log('Position ', _position, _toolEgg);

    switch (_position) {
      case "SubWindow":
        this.attachToolSubWindow(_toolEgg, _attachOptions.allowDuplicate);
        break;
      case "LeftNavigation":
        this.refs['LeftNavigation'].setState({toolEgg: _toolEgg});
        break;
      case "RightNavigation":
        this.refs['RightNavigation'].setState({toolEgg: _toolEgg});
        break;
      case "BottomNavigation":
        this.refs['BottomNavigation'].setState({toolEgg: _toolEgg});
        break;
      case "ModalWindow":
        this.refs['Modal'].setState({toolEgg: _toolEgg});
        break;
    }
  },


  applyToolStates(_toolEquipmentKey, _state){

    this.emit('StoreToolState', {
      toolKey: _toolEquipmentKey,
      state: _state
    });
  },

  notifyMessage(_title, _message, _level){
    this.refs['NotificationSystem'].notify({
      type: 'simple-message',
      title: _title,
      message: _message,
      level: (typeof _level !== 'undefined') ? _level : 'success'
    });
  },

  offContextMenu() {
    this.refs['stage-context-menu'].setState({display: 'off'});
  },

  attachToolSubWindow(_toolEgg, _allowDuplicate) {
    var subWindowSystem = this.refs['SubWindowSystem'];

    subWindowSystem.spawnSubWindow(_toolEgg.toolKey, _allowDuplicate || false, {
      title: _toolEgg.toolTitle,
      descType: "toolEgg",
      toolEgg: _toolEgg
    });
  },

  onThrowCatcherBeginDeployComponent(_eventData, _pass){
    var contextStage = this.refs['ContextStage'];

    //_componentName
    contextStage.startDeployComponentByPalette(_eventData.absoluteX, _eventData.absoluteY, _eventData.componentKey, _eventData.packageKey);
  },

  onThrowCatcherDragDeployComponent(_eventData, _pass){
    var contextStage = this.refs['ContextStage'];

    contextStage.dragDeployComponentByPalette(_eventData.absoluteX, _eventData.absoluteY, _eventData.componentKey, _eventData.packageKey);
  },

  onThrowCatcherDropDeployComponent(_eventData, _pass){
    var contextStage = this.refs['ContextStage'];

    contextStage.stopDeployComponentByPalette(_eventData.absoluteX, _eventData.absoluteY, _eventData.componentKey, _eventData.packageKey);
  },

  openStageContext(_contextSpec){
    var contextStage = this.refs['ContextStage'];

    contextStage.openContext(_contextSpec);
  },


  onThrowCatcherSelectElementNode(_eventData, _pass){
    this.refs['ContextStage'].selectElementNode(_eventData.elementNode);
  },

  // 성공적으로 요소가 선택되었을 때
  onThrowCatcherSuccessfullyElementNodeSelected(_eventData, _pass){
    this.noticeSelectedElementToTools(_eventData.elementNode, _eventData.contextController, _eventData.screenMode);
  },

  onThrowCatcherCancelSelectElementNode(_eventData, _pass){
    this.noticeSelectedElementToTools(null, null);
  },

  noticeSelectedElementToTools(_selectedElementNode, _contextController, _screenMode){
    this.applyToolStates("ElementNodeEditor", {
      elementNode: _selectedElementNode,
      contextController: _contextController
    });

    this.applyToolStates("ElementNodeControl", {
      elementNode: _selectedElementNode,
      contextController: _contextController
    });

    this.applyToolStates("ElementEventControl", {
      elementNode: _selectedElementNode,
      contextController: _contextController
    });

    this.applyToolStates("ElementEffectControl", {
      elementNode: _selectedElementNode,
      contextController: _contextController
    });

    this.applyToolStates("ContextContentsNavigation", {
      selectedElementNode: _selectedElementNode,
      contextController: _contextController
    });

    this.applyToolStates("ElementNodeGeometryEditor", {
      elementNode: _selectedElementNode,
      contextController:_contextController,
      screenMode: _screenMode
    });
  },

  noticeSelectedContextItemToTools(_selectedContextItem, _screenMode){


    this.applyToolStates("ServiceResources", {
      runningContext: _selectedContextItem
    });

    if( _selectedContextItem !== null ){
      this.applyToolStates("ContextContentsNavigation", {
        runningContext: _selectedContextItem.contextType === 'document'? _selectedContextItem:null
      });

      this.applyToolStates("DocumentCSSEditor", {
        contextController: _selectedContextItem.contextType === 'document'? _selectedContextItem.contextController:null
      });

      this.applyToolStates("FragmentScriptEditor", {
        contextController: _selectedContextItem.contextType === 'document'? _selectedContextItem.contextController:null
      });
    } else {
      this.applyToolStates("ContextContentsNavigation", {
        runningContext: null
      });

      this.applyToolStates("DocumentCSSEditor", {
        contextController: null
      });

      this.applyToolStates("FragmentScriptEditor", {
        contextController: null
      });
    }

    this.refs['HeadToolBar'].setState({
      contextItem: _selectedContextItem
    });
  },

  onThrowCatcherMouseEnterElementNode(_eventData, _pass){
    this.refs['ContextStage'].mouseEnterElement(_eventData.elementNode);
  },

  onThrowCatcherMouseLeaveElementNode(_eventData, _pass){
    this.refs['ContextStage'].mouseLeaveElement(_eventData.elementNode);
  },

  onThrowCatcherUpdatedContext(_eventData, _pass){
    this.applyToolStates("ContextContentsNavigation");
    this.refs['RightNavigation'].forceUpdate();
  },

  onThrowCatcherChangedSaveState(_eventData){
    this.refs['HeadToolBar'].forceUpdate();
    this.refs['ContextStage'].forceUpdate();
  },


  onThrowCatcherRefreshContextStage(){
    this.refs['ContextStage'].forceUpdate();
  },

  onThrowCatcherOpenElementNodeGeometryEditor(_eventData){
    this.emit('RequestAttachTool', {
      where: "RightNavigation",
      toolKey: "ElementNodeGeometryEditor"
    });
  },

  // 저장
  onThrowCatcherSaveCurrentContext(_eventData, _pass){
    console.log(_eventData, _pass);

    var docStage = this.refs['ContextStage'];
    var currentContext = docStage.getCurrentRunningContext();
    if (currentContext !== undefined) {
      currentContext.save();
    } else {
      this.notifyMessage('저장실패', "저장할 대상이 없습니다.", "error");
    }
  },

  onThrowCatcherChangeStageMode(_eventData, _pass){
    var mode = _eventData.mode;

    this.refs['ContextStage'].setStageMode(mode);
  },

  onThrowCatcherDocumentRedo(){
    var docStage = this.refs['ContextStage'];
    var currentContext = docStage.getCurrentRunningContext();

    if (currentContext === undefined) {
      this.notifyMessage('Undo할 수 없음.', 'Document가 포커싱되지 않았습니다.', 'info');
      return;
    } else {
      if (currentContext.props.contextType !== 'document') {
        this.notifyMessage('Undo할 수 없음.', '동작중인 Context가 document type이 아닙니다.', 'warning');
        return;
      }
    }

    var contextController = currentContext.props.contextController;
    if (!contextController.gotoFuture()) {
      this.notifyMessage('Redo 할 수 없음.', '더이상 기록된 변경사항이 없습니다.', 'warning');
    }
  },

  onThrowCatcherDocumentUndo(){
    var docStage = this.refs['ContextStage'];
    var currentContext = docStage.getCurrentRunningContext();

    if (currentContext === undefined) {
      this.notifyMessage('Undo할 수 없음.', 'Document가 포커싱되지 않았습니다.', 'info');
      return;
    } else {
      if (currentContext.props.contextType !== 'document') {
        this.notifyMessage('Undo할 수 없음.', '동작중인 Context가 document type이 아닙니다.', 'warning');
        return;
      }
    }


    var contextController = currentContext.props.contextController;
    if (!contextController.gotoPast()) {
      this.notifyMessage('Undo 할 수 없음.', '더이상 기록된 변경사항이 없습니다.', 'warning');
    }
  },

  onThrowCatcherResized(_eventData){

    if (_eventData.refPath[0] === 'LeftNavigation') {
      this.resizeContextStage();
    } else if (_eventData.refPath[0] === 'RightNavigation') {
      this.resizeContextStage();
    } else if (_eventData.refPath[0] === 'BottomNavigation') {
      this.resizeSideNavigation();
    }

  },

  resizeContextStage(){
    var contextStage = this.refs['ContextStage'];
    var headToolBarDOM = this.refs['HeadToolBar'].getDOMNode();
    var leftNavigationDOM = this.refs['LeftNavigation'].getDOMNode();
    var rightNavigationDOM = this.refs['RightNavigation'].getDOMNode();
    var bottomNavigationDOM = this.refs['BottomNavigation'].getDOMNode();


    contextStage.setState({
      width: this.getDOMNode().offsetWidth - parseInt(leftNavigationDOM.style.width) -  parseInt(rightNavigationDOM.style.width),
      height: this.getDOMNode().offsetHeight - headToolBarDOM.offsetHeight - parseInt(bottomNavigationDOM.style.height),
      x: parseInt(leftNavigationDOM.style.width),
      y: headToolBarDOM.offsetHeight
    });

  },

  resizeSideNavigation(){
    var contextStage = this.refs['ContextStage'];
    var leftNavigation = this.refs['LeftNavigation'];
    var rightNavigation = this.refs['RightNavigation'];
    var headToolBarDOM = this.refs['HeadToolBar'].getDOMNode();
    var bottomNavigationDOM = this.refs['BottomNavigation'].getDOMNode();

    leftNavigation.setState({
      top: headToolBarDOM.offsetHeight,
      bottom: parseInt(bottomNavigationDOM.style.height)
    });

    rightNavigation.setState({
      top: headToolBarDOM.offsetHeight,
      bottom: parseInt(bottomNavigationDOM.style.height)
    });
  },

  screenResized(){

    this.resizeSideNavigation();
    this.resizeContextStage();
  },


  componentDidUpdate(){
    console.log('workspace updated');
  },

  componentDidMount() {
    var self = this;
    this.leftAreaWidth = this.leftAreaWidth || 0;
    this.rightAreaWidth = this.rightAreaWidth || 0;
    // this.props.observers.resizeListener = function (_w, _h, _screenW, _screenH) {
    //     self.resizeListener(_w, _h, _screenW, _screenH);
    // };
  },

  render() {


    return (
      <div className='workspace'>
        <div className='editor-floor-supporters'>
          <HeadToolBar ref='HeadToolBar'/>


          <ToolNavigation ref="LeftNavigation"
                          defaultToolSize={350}
                          maxSize={700}
                          naviSize={45}
                          fontSize={22}
                          config={this.props.LeftNavigationConfig}
                          initialShow={true}
                          showTitle={false}
                          showIcon={true}
                          theme='dark'
                          verticalText={true}
                          position='left'/>


          <ToolNavigation ref="RightNavigation"
                          defaultToolSize={410}
                          maxSize={700}
                          naviSize={45}
                          fontSize={22}
                          config={this.props.RightNavigationConfig}
                          initialShow={true}
                          showTitle={false}
                          showIcon={true}
                          theme='dark'
                          verticalText={true}
                          position='right'/>

          <ToolNavigation ref="BottomNavigation"
                          defaultToolSize={310}
                          maxSize={700}
                          naviSize={27}
                          config={this.props.BottomNavigationConfig}
                          initialShow={false}
                          showTitle={true}
                          showIcon={true}
                          closeable={true}
                          theme='dark'
                          verticalText={true}
                          position='bottom'/>

          <ContextStage ref='ContextStage'
                          width={window.innerWidth}
                          height={window.innerHeight}
                         aimingCount={100}
                         aimingEscapeStepSize={10}
                         boundaryBorderSize={5}/>


          <FloatingMenuBox ref='stage-context-menu'/>


          <NotificationSystem ref='NotificationSystem'/>
          <SubWindowSystem ref='SubWindowSystem'/>
        </div>

        <Modal ref="Modal"/>
      </div>
    )
  }
});


export default Workspace;
