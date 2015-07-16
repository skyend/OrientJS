/**
 * ProjectNavigation.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    require('./RightNavigation.less');
    var React = require("react");

    var RightNavigation = React.createClass({
        getInitialState(){
            return {
                RightPanel : <div/>
            }
        },
        clickNaviItem(e, _naviMenu){
            // 패널
            if (this.fold) {
                this.unfoldPanel(); // 열기
            } else {
                this.foldPanel();   // 닫기
                return;
            }
            // panel표시 이벤트 호출
            this.props.onDisplayPanel(_naviMenu);
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

        naviMenuRender(_naviMenu){
            var self = this;
            return (
                <div className="item" onClick={function(e){ self.clickNaviItem(e, _naviMenu);} }>
                    <a>{ _naviMenu.itemTitle }</a>
                </div>
            )
        },

        componentDidMount(){
            this.foldPanel();
        },
        render() {

            this.props.menuList = this.props.menuList || [];
            var RightPanel = this.state.RightPanel;
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
                        {RightPanel}
                    </div>
                </aside>
            );
        }
    });

    module.exports = RightNavigation;

})();