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
    var React = require("react");

    var Contents = React.createClass({
        getDefaultProps(){
            this.observers = {};

            return {
                tabItemList : [
                    { id:'a' , name: 'tab test'},
                    { id:'b' , name: 'tab test2'}
                ]
            }
        },

        clickTabItem( _tabID ){
            console.log(_tabID);
            var listenerName = "onSwitchTab";

            if( typeof this.props[listenerName] === 'function' ){
                this.props[listenerName](_tabID);
            }
        },

        clickTabAdd(){
            console.log('tab add');

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

        render: function () {

            return (
                <section className="Contents Contents-tab-support black" id="ui-contents">
                    <div className='tab-switch-panel'>
                        <ul className='tab-list' ref='tab-list'>
                            { this.props.tabItemList.map( this.getTabItemElement )}
                            <li onClick={this.clickTabAdd}><i className='fa fa-plus'></i></li>
                        </ul>
                    </div>

                    <div className='tab-context'>
                        <iframe ref='iframe-stage' src='../html5up-directive/index.html'></iframe>
                    </div>

                    <DOMEditor ref='document-editor' onChange={this.onModifyDocument}/>
                </section>
            )
        }
    });

    module.exports = Contents;

})();


