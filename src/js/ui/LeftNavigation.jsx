/**
 * ProjectNavigation.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    var Utils = require('../builder.Utils.js'); // 상속 라이브러리 유틸
    var EventEmitter = require('../lib/EventEmitter.js');

    var React = require("react");


    var LeftNavigation = React.createClass({
        clickNaviItem(e, _naviItem){

            if (this.fold) {
                this.unfoldPanel();
            } else {
                // 한번더 클릭하면 패널을 닫는다.

                this.foldPanel();
                return;
            }

            // panel표시 이벤트 호출
            this.props.onDisplayPanel(_naviItem.itemKey);
        },

        resize(_width){
            this.getDOMNode().style.width = _width + 'px';

            this.props.onResize(_width);
        },

        foldPanel(){
            this.resize(this.props.naviWidth);

            this.refs['fold-trigger'].getDOMNode().style.display = 'none';
            this.refs['unfold-trigger'].getDOMNode().style.display = 'block';

            this.fold = true;
        },

        unfoldPanel(){
            this.resize(this.props.naviWidth + this.props.panelWidth);

            this.refs['unfold-trigger'].getDOMNode().style.display = 'none';
            this.refs['fold-trigger'].getDOMNode().style.display = 'block';

            this.fold = false;
        },

        naviItemRender(_naviItem){
            var self = this;
            return (
                <li title={_naviItem.itemTitle} onClick={function(e){ self.clickNaviItem(e, _naviItem); }}>
                    <span className={"glyphicon glyphicon-"+_naviItem.itemIcon}></span>
                </li>
            )
        },

        componentDidMount(){
            this.foldPanel();
        },
        render() {

            this.props.naviItems = this.props.naviItems || [];

            var foldIcon, unfoldIcon;
            if (this.props.panelPosition === 'left') {
                foldIcon = 'right';
                unfoldIcon = 'left';
            } else {
                foldIcon = 'left';

                unfoldIcon = 'right';
            }


            return (
                <aside id="ui-leftMenu">
                    <div class="menu">
                        <ul class="project">
                            <li title="Component"><a class="fa fa-th"></a></li>
                            <li title="Project tree"><i class="fa fa-caret-left"></i><a class="fa fa-briefcase"></a></li>
                            <li title="Sitemap"><a class="fa fa-cube"></a></li>
                            <li title="style"><a class="fa fa-header"></a></li>
                            <li title="String with I18N"><a class="fa fa-globe"></a></li>
                            <li title="Images"><a class="fa fa-cloud"></a></li>
                            <li title="Script"><a class="fa fa-leaf"></a></li>
                            <li title="Event"><a class="fa fa-fire"></a></li>
                            <li title="API"><a class="fa fa-cloud-download"></a></li>
                            <li title="Template"><a class="fa fa-file"></a></li>
                            <li title="Template"><a class="fa fa-file"></a></li>
                            <li title="Template"><a class="fa fa-file"></a></li>
                        </ul>
                    </div>
                    <div class="panel">
                        <div class="title">GRID</div>
                        <ul class="inventory">
                            <li>
                                <span>Grid 1</span>
                            </li>
                            <li>
                                <span>Grid 1</span>
                            </li>
                            <li>
                                <span>Grid 2</span>
                            </li>
                        </ul>
                        <div class="title">COMPONENT</div>
                        <ul class="inventory">
                            <li>
                                <span>Title</span>
                            </li>
                            <li>
                                <span>List</span>
                            </li>
                            <li>
                                <span>Table</span>
                            </li>
                        </ul>
                    </div>
                </aside>
            );
        }
    });

    module.exports = LeftNavigation;

})();


