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
        getInitialState(){
          return {
              panel : <div/>
          }
        },
        clickNaviItem(e, _naviMenu){

            if (this.fold) {
                this.unfoldPanel();
            } else {
                // 한번더 클릭하면 패널을 닫는다.

                this.foldPanel();
                return;
            }

            // panel표시 이벤트 호출
            this.props.onDisplayPanel(_naviMenu.itemKey);
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
                <li title={_naviMenu.itemTitle} onClick={function(e){ self.clickNaviItem(e, _naviMenu); }}>
                    <a className={"fa fa-"+_naviMenu.itemIcon}></a>
                </li>
            )
        },

        naviPanelRender(_naviPanel){
            var title = this;
            return (
                <div className="item">
                    <div className="title">{_naviPanel.itemTitle}</div>
                    <ul className="inventory">
                        {_naviPanel.items.map(function (item) {
                            return (
                                <li>
                                    <span>{item}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )
        },

        componentDidMount(){
            this.foldPanel();
        },
        render() {

            this.props.menuList = this.props.menuList || [];
            var PanelToolsUI = this.state.PanelToolsUI;

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
                    <div className="menu">
                        <ul className="project">
                            { this.props.menuList.Project.map(this.naviMenuRender)}
                        </ul>
                    </div>
                    <div className='panel' ref='panel'>
                        {PanelToolsUI}
                    </div>
                </aside>
            );
        }
    });

    module.exports = LeftNavigation;

})();


