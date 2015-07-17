/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

var $ = require('jquery');

(function () {
    require('./Contents.less');
    var DOMEditor = require('./panel/DocumentEditor.jsx');
    var PanelContainer = require('./PanelContainer.jsx');
    var React = require("react");

    var Contents = React.createClass({
        getDefaultProps(){
            this.observers = {};
            this.targetIFrame = null;

            return {
                tabItemList : [
                    { id:'a' , name: 'tab test'},
                    { id:'b' , name: 'tab test2'}
                ]
            }
        },

        clickTabItem( _tabID ){
            var listenerName = "onSwitchTab";

            if( typeof this.props[listenerName] === 'function' ){
                this.props[listenerName](_tabID);
            }
        },

        clickTabAdd(){
            var listenerName = "onAddTab";

            if( typeof this.props[listenerName] === 'function' ){
                this.props[listenerName](_tabID);
            }
        },

        onIframeLoaded( _iframe ){

            // 임시 차후에 EditorStageContext 에서 처리되어야 함
            var iwindow = _iframe.contentWindow || _iframe.contentDocument;
            var innerDocument = iwindow.document;
            this.iframeDocument = innerDocument;
            var html = innerDocument.querySelector('html').innerHTML;
            this.refs['document-editor'].setState({documentText:html});
        },

        componentDidMount(){
            var self = this;
            var iframe = this.refs['iframe-stage'].getDOMNode();
            iframe.onload = function(_e){
                self.onIframeLoaded(this);
            }
        },

        onModifyDocument( _documentHtml ){
            if( typeof this.iframeDocument === 'object' ) {
                this.iframeDocument.querySelector('html').innerHTML = _documentHtml;
            }
        },

        /**
         * reSzie()
         *
         * 아래의 footerPanelPart 기준으로 리사이즈 한다.
         */
        reSize(){
            var tabContext = this.refs['tab-context'];
            var footerPanelPart = this.refs['footer-panel-part'];
            var tabArea = this.refs['tab-area'];

            var tabContextDOM = tabContext.getDOMNode();
            var footerPanelPartDOM = footerPanelPart.getDOMNode();
            var tabAreaDOM = tabArea.getDOMNode();
            var selfDOM = this.getDOMNode();

            var selfDOMHeight = selfDOM.offsetHeight;
            var tabAreaDOMHeight = tabAreaDOM.offsetHeight;
            var footerPanelPartDOMHeight = footerPanelPartDOM.offsetHeight;

            var tabContextDOMHeight = selfDOMHeight - tabAreaDOMHeight - footerPanelPartDOMHeight;
            tabContextDOM.style.height = tabContextDOMHeight + 'px';
        },

        rePosition(){

        },

        onFooterPanelPartResize(){
            this.reSize();
        },

        getTabItemElement( _tabItem ){
            var self = this;
            var _tabID = _tabItem.id;

            var closure = function(){
                self.clickTabItem( _tabID);
            };

            return (
                <li onClick={closure}>{_tabItem.name}</li>
            )
        },

        componentDidUpdate( _prevProps, _prevState){

        },

        shouldComponentUpdate( _nextProps, _nextState ){
            // 다음 state 에 control 필드가 입력되면 컴포넌트를 업데이트 하지않고 변경된 속성만 반영한다.
            if( typeof _nextState.control === 'object' ){

                switch(_nextState.control.type){
                    case 'resize' :
                        this.props.width = _nextState.control.data.width;
                        this.props.height = _nextState.control.data.height;
                        this.reSize();
                }
                return false;
            }
        },

        render: function () {
            console.log('called render');
            return (
                <section className="Contents Contents-tab-support black" id="ui-contents">
                    <div ref='tab-area'  className='tab-switch-panel'>
                        <ul className='tab-list' ref='tab-list'>
                            { this.props.tabItemList.map( this.getTabItemElement )}
                            <li onClick={this.clickTabAdd}><i className='fa fa-plus'></i></li>
                        </ul>
                    </div>

                    <div className='tab-context' ref='tab-context'>
                        <iframe ref='iframe-stage' src='../html5up-directive/index.html'></iframe>
                    </div>

                    <PanelContainer ref='footer-panel-part'
                                    panelTitle="Document Editor"
                                    panel={<DOMEditor ref='document-editor' onChange={this.onModifyDocument}/>}
                                    onResize={this.onFooterPanelPartResize}/>

                </section>
            )
        }
    });

    module.exports = Contents;

})();


