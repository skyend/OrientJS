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
    var React = require("react");

    var Contents = React.createClass({

// Mixin EventDistributor
        mixins: [require('./reactMixin/EventDistributor.js')],

        getDefaultProps() {
            this.observers = {};
            this.targetIFrame = null;

            return {
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

        onIframeLoaded(_iframe) {
            var self = this;
// 임시 차후에 EditorStageContext 에서 처리되어야 함
            var iwindow = _iframe.contentWindow || _iframe.contentDocument;
            var innerDocument = iwindow.document;
            this.currentIframeDocument = innerDocument;

            this.bindContextMenuTrigger(_iframe);

            innerDocument.addEventListener('click', function (_ev) {
                self.onMouseClickAtStage(_ev);
            }, false);

            /* Document Editor 에 targetDOM 객체를 지정한다. */
            /*
             var documentEditor = this.refs['document-editor'];
             var targetDOM = innerDocument.querySelector('html');
             this.documentEditingTo = targetDOM;
             documentEditor.setState({targetDOM:targetDOM});
             */

//this.documentEditorUpdate();
        },

        /**
         * onMouseClickAtStage
         *
         */
        onMouseClickAtStage(_e) {

            this.emit("ClickElementInStage", {
                clickedTarget: null
            }, _e, "MouseClick");
        },

        /**
         * bindContextMenuTrigger
         *
         * Stage의 IFrame 내부를 클릭 했을 때 기존의 ContextMenu호출을 블럭하고 Builder자체의 Stage용 ContextMenu를 호출 하도록 이벤트를 입력한다.
         *
         * @param _iframe
         */
        bindContextMenuTrigger(_iframe) {
            var self = this;

            var iwindow = _iframe.contentWindow || _iframe.contentDocument;
            var innerDocument = iwindow.document;

            innerDocument.addEventListener('contextmenu', function (_e) {
                return self.onCallContextMenu(_e);
            }, false);
        },

        onCallContextMenu(_e) {
            _e.preventDefault();
            var selfDom = this.getDOMNode();
            console.log("call contextmenu", _e);
            var x,
                y;

            var editorStageWrapperX = parseInt(selfDom.style.left);
            var editorStageWrapperY = parseInt(selfDom.style.top);

            x = _e.clientX + editorStageWrapperX;
            y = _e.clientY + editorStageWrapperY + this.refs['tab-context'].getDOMNode().offsetTop;

            var targetElement = _e.toElement;

            this.emit("CallContextMenu", {
                mouseX: x,
                mouseY: y,

                // for 필드는 이 컨텍스트 메뉴가 무엇을 위한 컨텍스트 메뉴인지 의미한다.
                for: "StageElement", // 에디팅중인 도큐먼트의 Stage의 Element
                target: {
                    stageContextId: "", // 현재 편집중인 ContextID
                    elementId: "", // 컨텍스트 메뉴가 바라보는 ElementID / ID는 Dom 의 Attribute 중의 id 가 아니라 빌더에서만 사용되는 DOM요소의 특별한 ID이다. 예) --eid
                    element: targetElement
                }
            }, _e, "MouseEvent");

            return false;
        },

        componentDidMount() {
            var self = this;
            var iframe = this.refs['iframe-stage'].getDOMNode();

            iframe.onload = function (_e) {
                self.onIframeLoaded(this);
            };
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
            var footerToolPart = this.refs['footer-tool-part'];
            var tabArea = this.refs['tab-area'];

            var tabContextDOM = tabContext.getDOMNode();
            var footerToolPartDOM = footerToolPart.getDOMNode();
            var tabAreaDOM = tabArea.getDOMNode();
            var selfDOM = this.getDOMNode();

            var selfDOMHeight = selfDOM.offsetHeight;
            var tabAreaDOMHeight = tabAreaDOM.offsetHeight;
            var footerToolPartDOMHeight = footerToolPartDOM.offsetHeight;

            var tabContextDOMHeight = selfDOMHeight - tabAreaDOMHeight - footerToolPartDOMHeight;
            tabContextDOM.style.height = tabContextDOMHeight + 'px';
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
            this.refs['document-editor'].forceUpdate();
        },

        getTabItemElement(_tabItem) {
            var self = this;
            var _tabID = _tabItem.id;

            var closure = function () {
                self.clickTabItem(_tabID);
            };

            return (
                <li onClick={closure}>{_tabItem.name} <i className="fa fa-times"></i></li>
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

        componentDidUpdate(_prevProps, _prevState) {
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

                    <div className='tab-context' ref='tab-context'>
                        <iframe ref='iframe-stage' src='../html5up-directive/index.html'></iframe>
                    </div>

                    <ToolContainer tool={<DOMEditor ref='document-editor' onChange={this.onModifyDocument}/>} toolTitle="Document Editor" ref='footer-tool-part' resizeMe={this.onFooterToolPartResize}/>

                </section>
            )
        }
    });

    module.exports = Contents;

})();
