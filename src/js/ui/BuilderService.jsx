/**
 * Screen.jsx
 * 빌더의 전체적인 UI를 포함하고 컨트롤 하는 클래스
 *
 * Requires(js)  : BuilderNavigation.jsx
 * Requires(css) : Screen.less
 */

var _ = require('underscore');

(function () {
    require('./BuilderService.less');

    /* Panel Styles */
    //require('./panel/CSSMenu.less');
    var Loader = require('../lib/WebpackAsyncPartsLoader.js');
    var Async = require('../lib/Async.js');

    var HeadToolBar = require('./HeadToolBar.jsx');                     //상단 네비게이션 UI

    var VToolNavigation = require('./VerticalToolNavigation.jsx');



    var DocumentStage = require('./DocumentStage.jsx');                 //중앙 컨텐츠 영역 UI
    var FootStatusBar = require('./FootStatusBar.jsx');                     //하단 상태 표시줄 UI
    var Modal = require('./Modal.jsx');                         //Modal UI
    var FloatingMenuBox = require('./FloatingMenuBox.jsx');     //StageContextMenu
    var NotificationSystem = require('./NotificationSystem.jsx');             //PushMessage
    var SubWindowSystem = require('./SubWindowSystem/SubWindowSystem.jsx');
    var ResourceUploadArea = require('./ResourceUploadArea.jsx');

    var React = require('react');
    var cookie = require('js-cookie');

    /**
     * UIService
     *
     */
    var UIService = React.createClass({
        // Mixin EventDistributor
        mixins: [require('./reactMixin/EventDistributor.js')],

        getInitialState() {
            return { toolStatesStore : {} };
        },

        onThrowCatcherDisplayModal( _modalData, _pass ) {
            var triggers = this.props.Modal.triggers;

            var modalObj = triggers[_modalData.triggerKey];

            var toolKey = modalObj.equipToolKey;
            var toolSpec = this.props.Tools[toolKey];

            this.changeTool( toolKey, toolSpec, 'Modal', _modalData.value);
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
                        {
                            title: "Delete",
                            type: "button",
                            key: "elementDelete",
                            eventName: "StageElementDelete"
                        }, {
                            title: "Clone",
                            type: "button",
                            key: "elementClone",
                            eventName: "StageElementClone"
                        }, {
                            title: "Edit",
                            type: "button",
                            key: "elementEdit",
                            eventName: "StageElementEdit"
                        }, {
                            title: "New SubWindow(Test)",
                            type: "button",
                            key: "newSubwindowTest",
                            eventName: "NewSubWindow_Test"
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
                            title: "Select Parent",
                            type: "button",
                            key: "element-select-parent",
                            eventName: "SelectParentElementByStageElement"
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

        onThrowCatcherNewSubWindow_Test(_eventData, _pass) {
            this.offContextMenu();
            this.newSubWindow();
        },

        onThrowCatcherPopupModal_Test(_eventData, _pass){
            this.offContextMenu();
        },

        onThrowCatcherPushMessage_Test(_eventData, _pass){
            this.offContextMenu();
        },

        onThrowCatcherSelectParentElementByStageElement(_eventData, _pass) {

            this.offContextMenu();
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


        changeTool( _toolKey, _toolSpec, _toEquipRef, _extraParam ){
          var self  = this;

          /**
           * WaterFall 을 이용하여 비동기로드를 동기화한다.
           */
          Async.waterFall(_toolSpec, [function (__toolSpec, __cb)  {

              if (typeof __toolSpec !== 'object') {

                //self.refs[_toEquipRef].equipTool();
                throw new Error("Tool[" + _toolKey + "] Spec Object is not exists.");
              }

              if (typeof __toolSpec.jsxPath !== 'string') {
                  //self.refs[_toEquipRef].equipTool();
                  throw new Error("Tool[" + _toolKey + "] JSXPath is not exists.");
              }

              loadTool(__toolSpec.jsxPath + ".jsx", function (___err, ___tool) {
                  if (___err !== null) {

                      //self.refs[_toEquipRef].equipTool();
                      throw new Error("Fail to load tool[" + _toolKey + "].");
                  } else {
                      __cb(__toolSpec, ___tool);
                  }
              });
          }, function (__toolSpec, __tool, __cb) {

              // config 파일이 없다면 지나간다.
              if (typeof __toolSpec.configPath === 'undefined') {
                  return __cb(__tool, null);
              }

              loadJson(__toolSpec.configPath + ".json", function (___err, ___toolConfig) {
                  if (___err !== null) {
                      throw new Error("Fail to load tool[" + _toolKey + "]Config.");
                  } else {

                      __cb(__tool, ___toolConfig);
                  }
              });
          }, function (__tool, __toolConfig) {

              // Builder에 저장된 각 Tool State를 가져온다.
              var toolState = self.state.toolStatesStore[ _toolKey ] || {};
              toolState.extraParam = _extraParam;
              console.log( 'displayModal', _toolKey );
              self.refs[_toEquipRef].equipTool(__tool, __toolConfig, _toolKey, toolState);
              toolState.extraParam = null;
          }]);
        },

        onThrowCatcherNeedEquipTool(_eventData, _pass) {

            var toolKey = _eventData.toolKey;
            var toolSpec = this.props.Tools[toolKey];
            var toEquipRef = _eventData.refPath[0];

            this.changeTool( toolKey, toolSpec, toEquipRef);
        },

        // ElementNodeEditor 툴을 연다.
        onThrowCatcherOpenElementEditTool( _eventData, _pass ){
          var toolKey = "ElementNodeEditor";
          var toolSpec = this.props.Tools[toolKey];
          var toEquipRef = "RightNavigation";

          this.refs[toEquipRef].unfoldTool();
          this.changeTool( toolKey, toolSpec, toEquipRef);
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

          var footStatusBar = this.refs['FootStatusBar'];

          footStatusBar.setState({
            vnodePathArray:_eventData.nodeArrayPath
          });

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


        applyToolStates( _toolEquipmentKey, _state ){
          var prevToolStatesStore = this.state.toolStatesStore;
          var toolStateObject = prevToolStatesStore[_toolEquipmentKey];

          if( typeof toolStateObject === 'undefined' ){
            toolStateObject = {};
            prevToolStatesStore[_toolEquipmentKey] = toolStateObject;
          }

          // merge state
          _.extend(toolStateObject, _state);

          this.setState({toolStatesStore:prevToolStatesStore});


          var leftEquipTool = this.refs['LeftNavigation'].state.equipTool;
          var rightEquipTool = this.refs['RightNavigation'].state.equipTool;


          if( typeof leftEquipTool === 'object' ){
            if( leftEquipTool.toolKey === _toolEquipmentKey ){
              this.refs['LeftNavigation'].applyToolState( toolStateObject );
            }
          }

          if( typeof rightEquipTool === 'object' ){
            if( rightEquipTool.toolKey === _toolEquipmentKey ){
              this.refs['RightNavigation'].applyToolState( toolStateObject );
            }
          }


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

        newSubWindow() {
            var subWindowSystem = this.refs['SubWindowSystem'];

            subWindowSystem.spawnSubWindow({
                key: "New",
                desc: "New",
                duplication: true
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

        openDirectContext( _directContextItem ){
          var documentStage = this.refs['DocumentStage'];

          documentStage.openContext( _directContextItem );
        },

        onThrowCatcherSelecteElementNode(_eventData, _pass){
          this.applyToolStates("ElementNodeEditor", {
            elementNode: _eventData.elementNode
          });

          this.applyToolStates("ContextContentsNavigation", {
            selectedElementNode: _eventData.elementNode
          });

          this.refs['DocumentStage'].selectedElementNode( _eventData.elementNode);
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
        },

        onThrowCatcherDocumentFocused(_eventData, _pass){
          this.applyToolStates("DocumentConfig", {
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




        // 컨텐츠 영역 화면 리사이즈
        resizeSelf() {
            var selfDom = this.getDOMNode();
            var width = selfDom.offsetWidth;
            var height = selfDom.offsetHeight;


            if (typeof this.refs['DocumentStage'] === 'undefined') return; // throw new Error("Not found DocumentStage");

            var headerOffsetHeight = this.refs['HeadToolBar'].getDOMNode().offsetHeight;
            var footerOffsetHeight = this.refs['FootStatusBar'].getDOMNode().offsetHeight;


            // middleArea 의 넓이와 높이
            var middleAreaWidth = width - this.leftAreaWidth - this.rightAreaWidth;
            var middleAreaHeight = height - headerOffsetHeight - footerOffsetHeight;

            // DocumentStage ReactClass
            var middleAreaREle = this.refs['DocumentStage'];

            // DocumentStage Element
            var middleAreaDom = middleAreaREle.getDOMNode();

            // DocumentStage positioning & resizing
            middleAreaDom.style.width = middleAreaWidth + 'px';
            middleAreaDom.style.left = this.leftAreaWidth + 'px';
            middleAreaDom.style.top = headerOffsetHeight + "px";

            // documentStage에 resize 알림
            middleAreaREle.resize(middleAreaWidth, middleAreaHeight);


            // ToolNavigation에 최대로 펼칠 수 있는 넓이를 알려줌
            this.refs['LeftNavigation'].setState({maxWidth: this.leftAreaWidth + middleAreaWidth});
            this.refs['RightNavigation'].setState({maxWidth: this.rightAreaWidth + middleAreaWidth});
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



                    <DocumentStage ref='DocumentStage'
                                    aimingCount={100}
                                    aimingEscapeStepSize={10}
                                    boundaryBorderSize={5}  />
                    <FootStatusBar ref='FootStatusBar'/>

                    <FloatingMenuBox ref='stage-context-menu'/>
                    <Modal ref="Modal"/>

                    <NotificationSystem ref='NotificationSystem'/>
                    <SubWindowSystem ref='SubWindowSystem'/>
                </div>
            )
        }
    });

    module.exports = UIService;

    function loadTool(toolPath, callback) {
        try {
            var toolBundle = require("bundle!./tools/" + toolPath)
        } catch (e) {
            return callback(e);
        }
        toolBundle(function (page) {
            callback(null, page);
        })
    }
    //
    // function loadModal(pageName, callback) {
    //     try {
    //         var pageBundle = require("bundle!./modal/" + pageName)
    //     } catch (e) {
    //         return callback(e);
    //     }
    //     pageBundle(function (page) {
    //         callback(null, page);
    //     })
    // }

    function loadJson(pageName, callback) {
        try {
            var pageBundle = require("bundle!../../config/" + pageName)
        } catch (e) {
            return callback(e);
        }
        pageBundle(function (page) {
            callback(null, page);
        })
    }
})();
