/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */


(function () {
    require('./DocumentStage.less');
    var DOMEditor = require('./tools/DocumentEditor.jsx');
    var ToolContainer = require('./ToolContainer.jsx');
    var IFrameStage = require('./partComponents/IFrameStage.jsx');
    var DirectContext = require('./DirectContext.jsx');
    var VDomController = require('../virtualdom/VDomController.js');

    var React = require("react");

    var DocumentStage = React.createClass({

        // Mixin EventDistributor
        mixins: [require('./reactMixin/EventDistributor.js')],
        getInitialState(){

            return {
              directContexts : [
                { contextID : "TEST#1", targetContext: "" }
              ]
            }
        },

        getDefaultProps() {
            this.observers = {};
            this.targetIFrame = null;

            return {
                aimingCount : 100,
                aimingEscapeStepSize : 10,
                boundaryBorderSize:3,

                tabItemList: [
                    {
                        id: 'a',
                        name: 'tab test'
                    }, {
                        id: 'b',
                        name: 'tab test2'
                    }
                ]
            }
        },

        clickTabItem(_tabID) {
            var listenerName = "onSwitchTab";

            if (typeof this.props[listenerName] === 'function') {
                this.props[listenerName](_tabID);
            }
        },

        clickTabAdd() {
            var listenerName = "onAddTab";

            if (typeof this.props[listenerName] === 'function') {
                this.props[listenerName](_tabID);
            }
        },



        onModifyDocument(_documentHtml) {
            if (this.documentEditingTo !== null && typeof this.documentEditingTo !== 'undefined') {
                this.documentEditingTo.innerHTML = _documentHtml;
            }
        },

        /**
         * tabContextResize()
         *
         * 아래의 footerPanelPart 기준으로 리사이즈 한다.
         */
        tabContextResize() {
            var tabContext = this.refs['tab-context'];
            //var footerToolPart = this.refs['footer-tool-part'];
            var tabArea = this.refs['tab-area'];

            var tabContextDOM = tabContext.getDOMNode();
            //var footerToolPartDOM = footerToolPart.getDOMNode();
            var tabAreaDOM = tabArea.getDOMNode();
            var selfDOM = this.getDOMNode();

            var selfDOMHeight = selfDOM.offsetHeight;
            var tabAreaDOMHeight = tabAreaDOM.offsetHeight;
            //var footerToolPartDOMHeight = footerToolPartDOM.offsetHeight;

            var tabContextDOMHeight = selfDOMHeight - tabAreaDOMHeight;// - footerToolPartDOMHeight;
            tabContextDOM.style.height = tabContextDOMHeight + 'px';
        },

        getTabContextOffsetLeftByDS(){
          return this.refs['tab-context'].getDOMNode().offsetLeft;
        },

        getTabContextOffsetTopByDS(){
          return this.refs['tab-context'].getDOMNode().offsetTop;
        },

        /**
         * onFooterToolPartResize()
         *
         * FooterPanelPart의 사이즈가 조정 되었을 때 PanelContainer 에 의해 호출 된다.
         */
        onFooterToolPartResize() {

            /* tab-context 리사이즈 */
            this.tabContextResize();

            this.documentEditorUpdate();
        },

        documentEditorUpdate() {
            /* PanelContainer 에 삽입된 documentEditor 를 강제 업데이트 한다. */
            //this.refs['document-editor'].forceUpdate();
        },

        getTabItemElement(_tabItem) {
            var self = this;
            var _tabID = _tabItem.id;

            var closure = function () {
                self.clickTabItem(_tabID);
            };

            return (
                <li onClick={closure}>{_tabItem.name}</li>
            )
        },


        deleteElement(_targetObject) {
            console.log('called element delete ', _targetObject);

            // 임시로 요소 제거 공지
            this.emit('NoticeMessage', {
                title: "From DocumentStage",
                message: "element deleted"
            });
        },


        /*******************
         * startDeployComponentByPalette
         * 컴포넌트 배치 드래그 시작 리스너 (Begin Drag)
         * @Param _absoluteX
         * @Param _absoluteY
         * @Param _key
         */
        startDeployComponentByPalette( _absoluteX, _absoluteY, _key ){
          console.log(arguments);
          var iframeStage = this.refs['iframe-stage'];

          // VDomController Construct
          this.liveVDomController = new VDomController();
          this.liveVDomController.createVRoot(iframeStage.getIFrameInnerDoc().querySelectorAll('html').item(0));

        },


        /*******************
         * dragDeployComponentByPalette
         * 컴포넌트 배치 드래그 리스너 (Drag Move)
         * @Param _absoluteX
         * @Param _absoluteY
         * @Param _key
         */
        dragDeployComponentByPalette( _absoluteX, _absoluteY, _key ){
          var self = this;
          var iframeStage = this.refs['iframe-stage'];
          var selfClientRect = this.iframeStageBoundingRect;
          //console.log('drag');

          //****************************************/
          // 마우스 움직임의 강도에 따라 표적 해제 또는 드랍 위치 지정
          if( this.guideBoxLive ){

            // 가로 또는 세로가 aimingEscapeStepSize property 값 이상을 한번에 움직이면 표적을 해제한다.
            if( Math.abs(_absoluteX - this.prevMouseX) > this.props.aimingEscapeStepSize ||
                Math.abs(_absoluteY - this.prevMouseY) > this.props.aimingEscapeStepSize ){
              // 표적해제
              this.clearAim();
            } else {
              // 움직임이 비교정 미세하다면
              // 사용자는 컴포넌트를 드랍하기 위해 움직이고 있는것으로 간주 드랍위치를 파악한다.


              // 컴포넌트를 얻고자 하는 이벤트를 발생하여 컴포넌트를 얻는다
              // 컴포넌트를 반환받고 컴포넌트 배치 위치를 찾고
              // 컴포넌트가 배치될 위치를 표시한다.
              this.emit("GetComponent",{
                "componentKey" : _key,
                "return" : function( _err, _component ){
                  if( _err !== null ) throw new Error("component load error");

                  var direction = self.findGuideDirectBound(_absoluteX, _absoluteY);

                  self.showPreviewComponentDeployPosition(self.aimedTarget, direction, _component.positionHints);
                }
              });



            }
          }
          this.prevMouseX = _absoluteX;
          this.prevMouseY = _absoluteY;
          /*****************************************--끝--*/


          //****************************************/
          // 드래그위치에 따라 표적을 지정
          // 현재 드래그중인 영역이 스테이지 바운더리 내에 있는지 확인후 밖에 있다면 표적을 해제하고 함수 탈출
          if(!(( _absoluteX > selfClientRect.left && _absoluteX < selfClientRect.left + selfClientRect.width ) &&
              ( _absoluteY > selfClientRect.top  && _absoluteY < selfClientRect.top  + selfClientRect.height))) {

            this.clearAim();
            return;
          }

          // 대상리스트 뽑기
          var targetedList = this.rayTracingListUp( _absoluteX, _absoluteY );

          // 표적지정
          this.aimingTarget( targetedList, _absoluteX, _absoluteY );
          /*****************************************--끝--*/
        },

        /*******************
         * stopDeployComponentByPalette
         * 컴포넌트 배치 드래그 종료 및 드랍 리스너 (Drop)
         * @Param _absoluteX
         * @Param _absoluteY
         * @Param _key
         */
        stopDeployComponentByPalette( _absoluteX, _absoluteY, _key){
          var self = this;
          console.log(arguments);
          console.log('stop');

          //var targetedList = this.rayTracingListUp( _absoluteX, _absoluteY );

          // 표적이 지정된 상태에서 드래그 중지가 일어나면 해당엘리먼트를 기준으로 드랍한다는 것
          if( this.aimedTarget !== null ){

            // guide를 이용하여 컴포넌트 삽입 방향을 찾는다.
            var dropDirection = this.findGuideDirectBound(_absoluteX, _absoluteY);

            // React Component에서 Static HTML요소를 추출하기 위한 영역 요소
            var unboxingZone = this.refs['unboxing-zone'];
            var uZDom = unboxingZone.getDOMNode();

            this.emit("GetComponent",{
              "componentKey" : _key,
              "return" : function( _err, _component ){
                if( _err !== null ) throw new Error("component load error");

                // 컴포넌트의 랜더링 타입이 static 일 경우
                if( _component.renderType === 'static'){

                  // ReactComponent 의 static HTML을 추출한다.
                  var componentHtml = React.renderToStaticMarkup(React.createElement(_component.class));

                  // 보이지 않는 영역에 랜더링하여 컴포넌트 앨리먼트를 얻어낸다.
                  uZDom.innerHTML = componentHtml;

                  var componentStaticElement;
                  if( uZDom.childNodes.length === 1 ){
                    componentStaticElement = uZDom.childNodes[0];
                  } else if ( uZDom.childNodes.length > 1 ){
                    throw new Error("Component be must has 1 root.");
                  } else {
                    throw new Error("Component couldn't unboxing.");
                  }

                  if( typeof _component.CSS === 'string'){
                    self.refs['iframe-stage'].addStyle(_key, _component.CSS);
                  }


                  var deployResult = null;

                  //componentStaticElement.setAttribute('class', componentStaticElement.getAttribute('class').toLowerCase() );
                  if( dropDirection === 'in' ){
                    if( self.aimedTarget.name !== 'html' ){
                      deployResult = self.refs['iframe-stage'].insertElementToInLast(self.aimedTarget.vid, componentStaticElement);
                    } else {
                      self.errorNoticeDontInsertTo("HTML");
                      return;
                    }

                  } else if( dropDirection === 'left' || dropDirection === 'top' ){
                    if( self.aimedTarget.name !== 'body' ){
                      deployResult = self.refs['iframe-stage'].insertElementToBefore(self.aimedTarget.vid, componentStaticElement);
                    } else {
                      self.errorNoticeDontInsertTo("HTML");
                    }
                  } else if( dropDirection === 'right' || dropDirection === 'bottom' ){
                    if( self.aimedTarget.name !== 'body' ){
                      deployResult = self.refs['iframe-stage'].insertElementToAfter(self.aimedTarget.vid, componentStaticElement);
                    } else {
                      self.errorNoticeDontInsertTo("HTML");
                    }

                  }

                  // null 이 아니면 성공적으로 배치된 HTML Element 를 가진다.
                  if( deployResult !== null ){

                    self.deployedComponent( deployResult );
                  }

                }

              }
            });



            this.clearAim();
          }

          this.clearAim();
          // VDomController Destroy
          this.liveVDomController = null;
        },

        /**
         * deployedComponent
         * 배치완료된 요소 처리
         * @Param _attachedElement : DOMElement
         */
        deployedComponent( _attachedElement ){

        },

        /***************
         * getTargetPath
         * 대상요소의 Node를 분석하여 Path를 추출한다.
         * @Param _target Target이 되는 VNode
         */
        getTargetPath( _target ){
          var pathArray = [];

          // 드랍이 예상되는 요소의 Path를 반환
          getTargetPath(_target, pathArray);

          return pathArray;

          // 대상의 계층 Path를 추출하는 재귀 함수
          function getTargetPath( __target, __pathArray ){
            if( __target.parent !== null ){
              getTargetPath(__target.parent, __pathArray);

              __pathArray.push( __target );
            }
          }
        },

        errorNoticeDontInsertTo(_name){
          this.emit('NoticeMessage', {
            title:"컴포넌트 삽입 실패",
            message:_name+" 태그내에 직접 삽입할 수 없습니다.",
            level:"error"
          });
        },

        /*********
         * findGuideDirectBound
         * 가이드의 방향지정 영역으로 사용자가 가리키는 방향을 파악하며 가이드에 표시한다
         * @Param _absoluteX
         * @Param _absoluteY
         */
        findGuideDirectBound(_absoluteX, _absoluteY){
          var topBound = this.refs['drop-guide-box-top'];
          var bottomBound = this.refs['drop-guide-box-bottom'];
          var leftBound = this.refs['drop-guide-box-left'];
          var rightBound = this.refs['drop-guide-box-right'];
          var inBound = this.refs['drop-guide-box-in'];

          var boundArray = [topBound, bottomBound, leftBound, rightBound, inBound];
          var collision = null;
          for( var i = 0; i < boundArray.length; i++ ){
            var bound = boundArray[i];
            var boundRect = bound.getDOMNode().getBoundingClientRect();

            bound.getDOMNode().setAttribute('see', 'no');

            // 충돌체크
            if( ( boundRect.left < _absoluteX && boundRect.right  > _absoluteX ) &&
                ( boundRect.top  < _absoluteY && boundRect.bottom > _absoluteY ) ){
              collision = bound;
              //break;
            }
          }

          // 충돌요소가 null이 아니면
          if( collision !== null ){
            // 지정 방향 표시
            collision.getDOMNode().setAttribute('see', 'yes');
            return collision.getDOMNode().getAttribute('data-direction');
          }

          return undefined;
        },


        /************
         * showPreviewComponentDeployPosition
         * 컴포넌트가 배치될 곳을 표시해준다.
         * @Param _target : 컴포넌트 배치 기준요소
         * @Param _direction : 컴포넌트 배치 방향
         */
        showPreviewComponentDeployPosition( _target, _direction, _positionHints ){
          // ToDO
          var placeHolderDOM = this.refs['drop-position-placeholder'].getDOMNode();
          var transformedCoordinate = this.transformIFrameDocCoordinateIntoStageScreen({x:_target.element.offset.x, y:_target.element.offset.y});
          var targetParent = _target.parent;

          var x, y, w, h;

          var direction = _direction;

          var boundaryBorderSize = this.props.boundaryBorderSize;
          // 부모의 넓이와 positionHint에 따라 상하좌우를 변경한다.
          /*
          if( typeof _positionHints.float !== 'undefined' ){
            if( direction === 'right'){
              if( _target.computedStyle.float === 'left' ){
                if( _positionHints.float === 'left' ){
                  direction = 'right';
                } else {
                  direction = 'left';
                }
              } else if ( _target.computedStyle.float === 'right' ){
                if( _positionHints.float === 'right' ){
                  direction = 'left';
                } else {
                  direction = 'right';
                }
              }
            }
          }*/


          // 컴포넌트가 배치되었을 때 어느 방향에 위치해 있는지 미리 예측한다.
          // 컴포넌트와 기준요소의 넓이를 더하여 부모의 넓이보다 크다면
          // 컴포넌트가 배치될 위치는 상단 또는 하단이 될것이다.
          if( targetParent !== null ){
            var targetPWidth = targetParent.element.offset.width;
            var targetWidth = _target.element.offset.width;
            var componentWidth = _positionHints.width;

            var targetAndComponentWidth = targetWidth + componentWidth;

            if( targetAndComponentWidth > targetPWidth ){
              if( direction === 'left' ){
                direction = 'top';
              } else if (direction === 'right' ){
                direction = 'bottom';
              }
            }
          }


          if( direction === 'left' || direction === 'right' ){
            w = boundaryBorderSize;
            h = _target.element.offset.height;
            x = direction === 'left'? transformedCoordinate.x - boundaryBorderSize : transformedCoordinate.x + _target.element.offset.width;
            y = transformedCoordinate.y;


          } else if( direction === 'top' || direction === 'bottom' ){
            w = _target.element.offset.width;
            h = boundaryBorderSize;
            x = transformedCoordinate.x;
            y = direction === 'top'? transformedCoordinate.y - boundaryBorderSize : transformedCoordinate.y + _target.element.offset.height;

          } else {
            // in
            w = _target.element.offset.width - boundaryBorderSize * 2;
            h = _target.element.offset.height - boundaryBorderSize * 2;
            x = transformedCoordinate.x + boundaryBorderSize;
            y = transformedCoordinate.y + boundaryBorderSize;


          }



          placeHolderDOM.style.left = x + 'px';
          placeHolderDOM.style.top = y + 'px';
          placeHolderDOM.style.width = w +'px';
          placeHolderDOM.style.height = h +'px';
          placeHolderDOM.style.display = 'block';



        },

        hidePreviewComponentDeployPosition(){
          var placeHolderDOM = this.refs['drop-position-placeholder'].getDOMNode();
          placeHolderDOM.style.display = 'none';
        },

        transformIFrameDocCoordinateIntoStageScreen( _coordinate ){

          return {
            x : _coordinate.x - this.refs['iframe-stage'].getScrollX() + this.getTabContextOffsetLeftByDS(),
            y : _coordinate.y - this.refs['iframe-stage'].getScrollY() + this.getTabContextOffsetTopByDS()
          };
        },



        rayTracingListUp(_absoluteX, _absoluteY){
          if( this.liveVDomController === null ){
            throw new Error("LiveVDomController Is destroyed");
          }

          var selfClientRect = this.refs['iframe-stage'].getDOMNode().getBoundingClientRect();

          var checkX =  _absoluteX - this.iframeStageBoundingRect.left;
          var checkY =  _absoluteY - this.iframeStageBoundingRect.top + this.refs['iframe-stage'].getScrollY();

          var collisions = this.liveVDomController.rayTracer(checkX,checkY);

          return collisions;
        },


        /*************
         * aimingTarget
         * 대상을 표적으로 지정한다.
         * @Param _targetedList
         * @Param _absoluteX
         * @Param _absoluteY
         */
        aimingTarget( _targetedList, _absoluteX, _absoluteY ){
          var self = this;
          // Single Targeted
          if(_targetedList.length == 1){
            var target = _targetedList[0];

            /*
            var dot = document.createElement("div");
            dot.style.position = 'absolute';
            dot.style.zIndex = 9999;
            dot.style.width = dot.style.height = '10px';
            dot.style.backgroundColor = '#000';
            dot.style.left = targetCenterX +'px';
            dot.style.top = targetCenterY+ 'px';

            document.body.appendChild(dot);
            */

            ///////////////
            // Element HighLighter
            // 엘리먼트의 영역을 표시하는 박스를 표시한다.
            // if 표적이 지정된 상태라면 then 해당 표적을 하이라이팅한다.
            if( this.aimedTarget !== null && typeof this.aimedTarget !== 'undefined'){
              this.showElementHighlight( this.aimedTarget );
            } else {
              // else 표적이 지정되지 않은 상태라면 새로운 표적을 지정하기 위해 카운트를 들어간다.
              // 카운드가 되는 도중 aimingTarget 메소드가 호출되면 재 카운팅에 들어간다.

              // 현재 대상 하이라이팅
              this.showElementHighlight( target );

              //////////////////////////////
              // Drop GuideBox
              var self = this;
              if( this.aimingTimeoutId !== 'undefined' ){
                // timeout제거
                this.clearAimCounter();
              }

              // 0.1초간 머무르면 그 대상이 표적으로 지정된다.
              // 0.1초간 움직임이 없으면 현재타겟을 드랍대상으로 지정하여 가이드박스를 표시한다.
              this.aimingTimeoutId = setTimeout(function(){
                self.aimTarget(target, _absoluteX, _absoluteY);
                // timeout 제거
                self.clearAimCounter();
              }, this.props.aimingCount);

              this.expectDropToVNode(target);
            }

          } else {
            console.log('multi selected', _targetedList);
          }
        },

        aimTarget(target, _absoluteX, _absoluteY){
          this.showGuideBox(target, _absoluteX, _absoluteY);
          this.expectDropToVNode(target);
          this.aimedTarget = target;
        },

        expectDropToVNode( _target ){
          // 현재 커서가 가리키는 대상 Path
          this.emit("ExpectedDropToVNodePath",{
            nodeArrayPath: this.getTargetPath(_target)
          });
        },

        // 표적 해제
        clearAim(){
          this.aimedTarget = null;
          this.hideGuideBox();
          this.hideElementHighlight();
          this.clearAimCounter();
          this.hidePreviewComponentDeployPosition();
        },

        clearAimCounter(){
          clearTimeout(this.aimingTimeoutId);
        },


        showGuideBox(_target, _absoluteX, _absoluteY){
          this.guideBoxLive = true;


          var dropGuideBox = this.refs['drop-guide-box'].getDOMNode();
          dropGuideBox.style.display = 'block';

          // 대상의 중심에 가이드 박스를 표시하는 방식
          /*
          var targetCenterX = _target.element.offset.x + this.iframeStageBoundingRect.left + (_target.element.offset.width/2);
          var targetCenterY = _target.element.offset.y + this.iframeStageBoundingRect.top + (_target.element.offset.height/2);

          // Guide Box 위치 지정
          dropGuideBox.style.left = (targetCenterX -  (dropGuideBox.offsetWidth/2)) + 'px';
          dropGuideBox.style.top = (targetCenterY - this.refs['iframe-stage'].getScrollY()  - (dropGuideBox.offsetHeight/2)) + 'px';
          */

          // 마우스커서가 있는 곳에 가이드박스를 표시하는 방식
          dropGuideBox.style.left = (_absoluteX -  (dropGuideBox.offsetWidth/2)) + 'px';
          dropGuideBox.style.top = (_absoluteY - (dropGuideBox.offsetHeight/2)) + 'px';
        },


        hideGuideBox(){
          var dropGuideBox = this.refs['drop-guide-box'].getDOMNode();
          dropGuideBox.style.display = 'none';

          this.guideBoxLive = false;
        },

        showElementHighlight( _target ){
          var highligher = this.refs['element-highlighter'].getDOMNode();
          highligher.style.left = _target.element.offset.x +'px';
          console.log( this.getTabContextOffsetTopByDS() ,'top');
          highligher.style.top = _target.element.offset.y - this.refs['iframe-stage'].getScrollY() + this.getTabContextOffsetTopByDS() + 'px';
          highligher.style.width = _target.element.offset.width +'px';
          highligher.style.height = _target.element.offset.height +'px';
          highligher.style.display = 'block';
        },


        hideElementHighlight(){
          var highligher = this.refs['element-highlighter'].getDOMNode();
          highligher.style.display = 'none';
        },

        attachDirectContext( _directContext ){

          return (
            <DirectContext ref='direct-context' width="100%" height="100%"/>
          )
        },

        componentDidUpdate(_prevProps, _prevState) {
          this.iframeStageBoundingRect = this.refs['iframe-stage'].getDOMNode().getBoundingClientRect();

        },

        componentDidMount() {

          this.iframeStageBoundingRect = this.refs['iframe-stage'].getDOMNode().getBoundingClientRect();
          //this.refs['iframe-stage'].setState({src:'../html5up-directive1/index.html'});
          //this.refs['iframe-stage'].setState({src:'about:blank'});
          this.clearAim()
        },

        resize( _width, _height){
            this.props.width = _width;
            this.props.height = _height;
            this.tabContextResize();
            this.documentEditorUpdate();
        },

        render: function () {

            return (
                <section className="Contents Contents-tab-support black" id="ui-contents">
                    <div className='tab-switch-panel' ref='tab-area'>
                        <ul className='tab-list' ref='tab-list'>
                     {this.props.tabItemList.map(this.getTabItemElement)}
                            <li onClick={this.clickTabAdd}>
                                <i className='fa fa-plus'></i>
                            </li>
                        </ul>
                    </div>

                    <div className='drop-guide-box' ref='drop-guide-box'>
                      <div className=''></div>
                      <div className='direction' data-direction='top' ref='drop-guide-box-top'> TOP </div>
                      <div className=''></div>
                      <div className='direction' data-direction='left'  ref='drop-guide-box-left'>LEFT</div>
                      <div className='direction in' data-direction='in'  ref='drop-guide-box-in'>IN</div>
                      <div className='direction' data-direction='right'  ref='drop-guide-box-right'>RIGHT</div>
                      <div className=''></div>
                      <div className='direction' data-direction='bottom'  ref='drop-guide-box-bottom'>BOTTOM</div>
                      <div className=''></div>
                    </div>

                    <div className='element-highlighter' ref='element-highlighter' style={{"border-width":this.props.boundaryBorderSize}}/>
                    <div className='drop-position-placeholder' ref='drop-position-placeholder'/>

                    <div className='tab-context' ref='tab-context'>
                        <IFrameStage ref='iframe-stage' width={this.props.width} height={this.props.height} src='../html5up-directive1/index.html'/>
                    </div>


                    <div className='unboxing-zone' ref='unboxing-zone'>

                    </div>
                </section>
            )
        }
    });

    module.exports = DocumentStage;

})();
