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
import VToolNavigation from'./VerticalToolNavigation.jsx';
import ToolNavigation from './ToolNavigation.jsx';

import DocumentStage from './DocumentStage.jsx'; //중앙 컨텐츠 영역 UI
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
        return { toolStatesStore : {} };
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

        this.refs['DocumentStage'].deleteElement({
            contextId: _eventData.target.contextId,
            elementId: _eventData.target.elementId
        });


        this.offContextMenu();
    },

    onThrowCatcherStageElementClone(_eventData, _pass) {
        this.offContextMenu();
        this.refs['DocumentStage'].setState({a: 1});
    },

    onThrowCatcherStageElementEdit(_eventData, _pass) {
        this.offContextMenu();
    },

    onThrowCatcherEditDocumentCSS(_eventData, _pass) {
        this.offContextMenu();

        this.emit('RequestAttachTool', {
          where:"SubWindow",
          toolKey:"DocumentConfig"
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
      this.refs['BottomNavigation'].setState({show:true});
    },


    onThrowCatcherFoldTool(_eventData, _pass) {

        if (_eventData.refPath[0] === 'RightNavigation') {
            this.rightAreaWidth = _eventData.width;

        } else if (_eventData.refPath[0] === 'LeftNavigation') {
            this.leftAreaWidth = _eventData.width;
        }

        this.resizeSelf();
    },

    onThrowCatcherUnfoldTool(_eventData, _pass) {

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
        domElementPathArray:_eventData.pathArray
      });

    },

    onThrowCatcherExpectedDropToVNodePath(_eventData, _pass) {
      //console.log('recieve', _eventData);


    },


    onThrowCatcherNeedProjectMeta(_eventData, _pass){
      //console.log('NeedProjectMeta',this.state.projectMeta);

      _eventData.path[0].setState( { 'meta': this.state.projectMeta });
    },


    onThrowCatcherNoticeMessage(_eventData, _pass) {
        this.notifyMessage(_eventData.title, _eventData.message, _eventData.level);
    },

    // 열린 컨텍스트 탭
    onThrowCatcherOpenedDirectContextTab( _eventData, _pass ){
      //console.log(_eventData);
      console.log('컨텍스트가 열렸습니다.');
      this.applyToolStates("ServiceResources",{
        runningContext: _eventData.contextItem
      });


      console.log("con", _eventData );
      this.applyToolStates("ContextContentsNavigation",{
        runningContext: _eventData.contextItem
      });
    },

    attachTool( _position, _toolEgg ){
      //console.log('Position ', _position, _toolEgg);

      switch( _position ){
        case "SubWindow":
          this.attachToolSubWindow(_toolEgg);
          break;
        case "LeftNavigation":
          this.refs['LeftNavigation'].setState({toolEgg: _toolEgg});
          break;
        case "RightNavigation":
          this.refs['RightNavigation'].setState({toolEgg: _toolEgg});
          break;
        case "BottomNavigation":
          this.refs['BottomNavigation'].setState({toolEgg: _toolEgg});
        case "ModalWindow":
      }

      this.resizeSelf();

    },

    applyToolStates( _toolEquipmentKey, _state ){
      //console.log('HIHIHIHIHI',_toolEquipmentKey, _state);
      this.emit('StoreToolState', {
        toolKey : _toolEquipmentKey,
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

    attachToolSubWindow( _toolEgg ) {
        var subWindowSystem = this.refs['SubWindowSystem'];

        subWindowSystem.spawnSubWindow(_toolEgg.toolKey, false, {
          title:_toolEgg.toolTitle,
          descType: "toolEgg",
          toolEgg: _toolEgg
        });
    },

    newSubWindow() {
        var subWindowSystem = this.refs['SubWindowSystem'];

        subWindowSystem.spawnSubWindow('New', false, {
          title:'aae',
          descType: "New",


        });
    },

    onThrowCatcherBeginDeployComponent(_eventData, _pass){
        var documentStage = this.refs['DocumentStage'];

        //_componentName
        documentStage.startDeployComponentByPalette(_eventData.absoluteX, _eventData.absoluteY, _eventData.componentKey, _eventData.packageKey);
    },

    onThrowCatcherDragDeployComponent(_eventData, _pass){
      var documentStage = this.refs['DocumentStage'];

        documentStage.dragDeployComponentByPalette(_eventData.absoluteX, _eventData.absoluteY, _eventData.componentKey, _eventData.packageKey);
    },

    onThrowCatcherDropDeployComponent(_eventData, _pass){
      var documentStage = this.refs['DocumentStage'];

      documentStage.stopDeployComponentByPalette(_eventData.absoluteX, _eventData.absoluteY, _eventData.componentKey, _eventData.packageKey);
    },

    openStageContext( _contextSpec ){
      var documentStage = this.refs['DocumentStage'];

      documentStage.openContext( _contextSpec );
    },


    onThrowCatcherSelectElementNode(_eventData, _pass){
      this.refs['DocumentStage'].selectElementNode( _eventData.elementNode);
    },

    // 성공적으로 요소가 선택되었을 때
    onThrowCatcherSuccessfullyElementNodeSelected(_eventData, _pass){

      this.applyToolStates("ElementNodeEditor", {
        elementNode: _eventData.elementNode
      });

      this.applyToolStates("ElementNodeControl", {
        elementNode: _eventData.elementNode
      });

      this.applyToolStates("ElementEventControl", {
        elementNode: _eventData.elementNode
      });

      this.applyToolStates("ElementEffectControl", {
        elementNode: _eventData.elementNode
      });

      this.applyToolStates("ContextContentsNavigation", {
        selectedElementNode: _eventData.elementNode
      });
    },

    onThrowCatcherCancelSelectElementNode(_eventData, _pass){
      this.applyToolStates("ElementNodeEditor", {
        elementNode: null
      });

      this.applyToolStates("ContextContentsNavigation", {
        selectedElementNode: null
      });
    },

    onThrowCatcherMouseEnterElementNode(_eventData, _pass){
      this.refs['DocumentStage'].mouseEnterElement( _eventData.elementNode);
    },

    onThrowCatcherMouseLeaveElementNode(_eventData, _pass){
      this.refs['DocumentStage'].mouseLeaveElement( _eventData.elementNode);
    },

    onThrowCatcherUpdatedContext(_eventData, _pass){
      this.applyToolStates("ContextContentsNavigation");
      this.refs['RightNavigation'].forceUpdate();
    },

    onThrowCatcherDocumentFocused(_eventData, _pass){
      this.applyToolStates("DocumentConfig", {
        document: _eventData.document
      });

      this.applyToolStates("DocumentCSSEditor", {
        document: _eventData.document
      });
    },


    // 저장
    onThrowCatcherSaveCurrentContext( _eventData, _pass ){
      console.log(_eventData, _pass);

      var docStage = this.refs['DocumentStage'];
      var currentContext = docStage.getCurrentRunningContext();
      if( currentContext !== undefined ){
        currentContext.save();
      } else {
        this.notifyMessage('저장실패', "저장할 대상이 없습니다.", "error");
      }
    },

    onThrowCatcherChangeStageMode( _eventData, _pass){
      var mode = _eventData.mode;

      this.refs['DocumentStage'].setStageMode( mode );
    },

    onThrowCatcherDocumentRedo(){
      var docStage = this.refs['DocumentStage'];
      var currentContext = docStage.getCurrentRunningContext();

      if( currentContext === undefined ){
        this.notifyMessage('Undo할 수 없음.', 'Document가 포커싱되지 않았습니다.', 'info');
        return;
      } else {
        if( currentContext.props.contextType !== 'document' ) {
          this.notifyMessage('Undo할 수 없음.', '동작중인 Context가 document type이 아닙니다.', 'warning');
          return;
        }
      }

      var contextController = currentContext.props.contextController;
      if(!contextController.gotoFuture()){
        this.notifyMessage('Redo 할 수 없음.','더이상 기록된 변경사항이 없습니다.', 'warning');
      }
    },

    onThrowCatcherDocumentUndo(){
      var docStage = this.refs['DocumentStage'];
      var currentContext = docStage.getCurrentRunningContext();

      if( currentContext === undefined ){
        this.notifyMessage('Undo할 수 없음.', 'Document가 포커싱되지 않았습니다.', 'info');
        return;
      } else {
        if( currentContext.props.contextType !== 'document' ) {
          this.notifyMessage('Undo할 수 없음.', '동작중인 Context가 document type이 아닙니다.', 'warning');
          return;
        }
      }


      var contextController = currentContext.props.contextController;
      if( !contextController.gotoPast() ){
        this.notifyMessage('Undo 할 수 없음.','더이상 기록된 변경사항이 없습니다.', 'warning');
      }
    },

    onThrowCatcherResized(){
      console.log('resized');
      this.resizeSelf();
    },




    // 컨텐츠 영역 화면 리사이즈
    resizeSelf() {
        var selfDom = this.getDOMNode();

        var leftNavigation = this.refs['LeftNavigation'];
        var rightNavigation = this.refs['RightNavigation'];
        var bottomNavigation = this.refs['BottomNavigation'];
        var documentStage = this.refs['DocumentStage'];
        var headToolBar = this.refs['HeadToolBar'];
        var footerStatusBar = this.refs['FootStatusBar'];

        var bottomNavigationDOM = bottomNavigation.getDOMNode();






        var width = selfDom.offsetWidth;
        var height = selfDom.offsetHeight;

        var headerOffsetHeight = headToolBar.getDOMNode().offsetHeight;


        // middleArea 의 넓이와 높이
        var documentStageWidth = width - this.leftAreaWidth - this.rightAreaWidth;
        var documentStageHeight = height - headerOffsetHeight - bottomNavigationDOM.offsetHeight;

        // DocumentStage ReactClass


        // DocumentStage Element
        var documentStageDom = documentStage.getDOMNode();

        var documentStageRect = {
          width : documentStageWidth,
          height: documentStageHeight,
          left : this.leftAreaWidth,
          top : headerOffsetHeight
        };

        // documentStage에 resize 알림
        documentStage.resize(documentStageRect);


        // ToolNavigation에 최대로 펼칠 수 있는 넓이를 알려줌
        leftNavigation.setState({maxWidth: this.leftAreaWidth + documentStageWidth, height:documentStageHeight });
        rightNavigation.setState({maxWidth: this.rightAreaWidth + documentStageWidth, height:documentStageHeight });
    },

    resizeListener(_w, _h, _screenW, _screenH) {
        var selfDom = this.getDOMNode();
        selfDom.style.width = _w + 'px';
        selfDom.style.height = _h + 'px';

        this.width = _w;
        this.height = _h;
        this.screenWidth = _screenW;
        this.screenHeight = _screenH;

        this.resizeSelf();
    },

    componentDidMount() {
        var self = this;
        this.leftAreaWidth = this.leftAreaWidth || 0;
        this.rightAreaWidth = this.rightAreaWidth || 0;
        this.props.observers.resizeListener = function (_w, _h, _screenW, _screenH) {
            self.resizeListener(_w, _h, _screenW, _screenH);
        };
    },

    render() {
        return (
            <div>
                <HeadToolBar ref='HeadToolBar'/>

                <VToolNavigation ref="LeftNavigation"
                                config={this.props.LeftNavigationConfig}
                                naviWidth={50}
                                toolWidth={270}
                                position='left'
                                naviItemFontSize={20}/>

                <VToolNavigation ref="RightNavigation"
                                 config={this.props.RightNavigationConfig}
                                 naviWidth={25}
                                 toolWidth={420}
                                 showTitle={true}
                                 verticalText={true}
                                 position='right'
                                 naviItemFontSize={16}/>

               <ToolNavigation ref="BottomNavigation"
                                defaultToolSize={310}
                                maxSize={700}
                                config={this.props.BottomNavigationConfig}
                                initialShow={false}
                                showTitle={true}
                                showIcon={true}
                                theme='dark'
                                verticalText={true}
                                position='bottom' />

                <DocumentStage ref='DocumentStage'
                                aimingCount={100}
                                aimingEscapeStepSize={10}
                                boundaryBorderSize={5}  />


                <FloatingMenuBox ref='stage-context-menu'/>
                <Modal ref="Modal"/>

                <NotificationSystem ref='NotificationSystem'/>
                <SubWindowSystem ref='SubWindowSystem'/>
            </div>
        )
    }
});

export default Workspace;