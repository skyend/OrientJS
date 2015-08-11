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
    var VDomController = require('../virtualdom/VDomController.js');

    var React = require("react");

    var DocumentStage = React.createClass({

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



        componentDidMount() {
            this.refs['iframe-stage'].setState({src:'../html5up-directive/index.html'});
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

        startDeployComponentByPalette( _absoluteX, _absoluteY, _key ){
          console.log(arguments);
          var iframeStage = this.refs['iframe-stage'];

          this.liveVDomController = new VDomController();
          this.liveVDomController.createVRoot(iframeStage.getIFrameInnerDoc().querySelectorAll('body').item(0));

        },

        dragDeployComponentByPalette( _absoluteX, _absoluteY, _key ){
          var iframeStage = this.refs['iframe-stage'];
          var selfClientRect = iframeStage.getDOMNode().getBoundingClientRect();

          if(!(( _absoluteX > selfClientRect.left && _absoluteX < selfClientRect.left + selfClientRect.width ) &&
              ( _absoluteY > selfClientRect.top  && _absoluteY < selfClientRect.top  + selfClientRect.height))) return;


          var checkX =  _absoluteX - selfClientRect.left;
          var checkY =  _absoluteY - selfClientRect.top + iframeStage.getScrollY();
          console.log(checkY);
          var collisionStack = this.liveVDomController.click(checkX,checkY);

          var finalCollision = collisionStack.pop();

          console.log(finalCollision.element.object, iframeStage.getScrollY());
        },

        stopDeployComponentByPalette( _absoluteX, _absoluteY, _key){
          console.log(arguments);
          this.liveVDomController = null;
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
                        <IFrameStage ref='iframe-stage' src='../html5up-directive/index.html' width="100%" height="100%"/>
                    </div>

                    <ToolContainer tool={<DOMEditor ref='document-editor' onChange={this.onModifyDocument}/>} toolTitle="Document Editor" ref='footer-tool-part' resizeMe={this.onFooterToolPartResize}/>

                </section>
            )
        }
    });

    module.exports = DocumentStage;

})();
