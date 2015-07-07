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


    var RightNavigation = React.createClass({
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
            this.refs['panel'].getDOMNode().style.display = 'none';
            this.fold = true;
        },

        unfoldPanel(){
            this.resize(this.props.naviWidth + this.props.panelWidth);
            this.refs['panel'].getDOMNode().style.display = 'block';
            this.fold = false;
        },

        naviMenuRender(_naviItem){
            var self = this;
            return (
                <div className="item" onClick={function(e){ self.clickNaviItem(e, _naviItem);} }>
                    <a>
                        { _naviItem.itemTitle }
                    </a>
                </div>
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
                <aside id="ui-rightMenu">
                    <div className="menu">
                        { this.props.menuList.map(this.naviMenuRender)}
                    </div>
                    <div className="panel" ref="panel">
                        <div className="title">CSS</div>
                        <div className="inventory"></div>
                    </div>
                </aside>
            );
        }
    });

    module.exports = RightNavigation;

})();