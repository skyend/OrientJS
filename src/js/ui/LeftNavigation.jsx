/**
 * ProjectNavigation.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */
var $ = require('jquery');
require('jquery-ui');

(function () {
    require('./LeftNavigation.less');
    var React = require("react");

    var LeftNavigation = React.createClass({
        mixins:[ require('./reactMixin/EventDistributor.js') ],

        getInitialState(){
            return {
                LeftPanel: <div/>
            }
        },

        clickNaviItem(_e, _naviMenu){
            var target = _naviMenu.action.target;
            switch (target) {
                case "Modal":
                    break;
                case "LeftPanel":
                    if (this.fold) {
                        this.unfoldPanel();
                    } else {
                        //// 한번더 클릭하면 패널을 닫는다.
                        //this.foldPanel();
                        //return;
                    }
            }


            // panel표시 이벤트 호출
            //this.props.onDisplayPanel(_naviMenu);

            this.emit('DisplayPanel', _naviMenu, _e, "MouseClick");
        },

        resize(_width){
            this.getDOMNode().style.width = _width + 'px';
            //$('#ui-leftMenu').animate({width: _width}, 400);
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
            var data = [];
            var keys = Object.keys(_naviMenu);
            var self = this;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                data.push(
                    <ul className={key}>
                        {_naviMenu[key].map(function (_naviMenuData) {
                            if (_naviMenuData.action.target == "Modal") {
                                return (
                                    <li title={_naviMenuData.title}
                                        onClick={function(e){ self.clickNaviItem(e, _naviMenuData); }}>
                                        <a href="#ui-modal" className={"fa fa-"+_naviMenuData.icon}></a>
                                    </li>
                                );
                            } else {
                                return (
                                    <li title={_naviMenuData.title}
                                        onClick={function(e){ self.clickNaviItem(e, _naviMenuData); }}>
                                        <a className={"fa fa-"+_naviMenuData.icon}></a>
                                    </li>
                                );
                            }
                        })}
                    </ul>
                )
            }
            return data;
        },

        componentDidMount(){
            this.foldPanel();
        },

        render() {

            this.props.menuList = this.props.menuList || [];
            var LeftPanel = this.state.LeftPanel;
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
                        {this.naviMenuRender(this.props.menuList)}
                    </div>
                    <div className='panel' ref='panel'>
                        {LeftPanel}
                    </div>
                </aside>
            );
        }
    });

    module.exports = LeftNavigation;

})();


