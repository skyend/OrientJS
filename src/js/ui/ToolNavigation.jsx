/**
 * PanelNavigation.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    var React = require("react");
    require('./ToolNavigation.less');

    var ToolNavigation = React.createClass({
        mixins: [require('./reactMixin/EventDistributor.js')],
        getInitialState() {

            return {
                targetPanelItem: null,
                panelElementInstance: null
            }
        },


        resize(_width) {
            this.getDOMNode().style.width = _width + 'px';
        },

        foldPanel() {
            this.resize(this.props.naviWidth);
            this.refs['toolArea'].getDOMNode().style.display = 'none';
            this.fold = true;

            this.emit('FoldPanel', {width: this.props.naviWidth});
        },

        unfoldPanel() {
            var width = this.props.naviWidth + this.props.panelWidth;
            this.resize(width);
            this.refs['toolArea'].getDOMNode().style.display = 'block';
            this.fold = false;

            this.emit('UnfoldPanel', {width: width});
        },

        startHookDrag(e) {
            console.log('start drag');
        },

        naviItemGroupRender(_group) {
            var items = _group.menuItems;

            return (
                <ul className="group">
                    { items.map(this.naviItemRender) }
                </ul>);
        },

        naviItemRender(_menuItem) {
            var self = this;
            var classes = [];

            if (this.props.verticalText) {
                classes.push('vertical-text-display');
            }

            if (this.state.openedMenuKey === _menuItem.key) {
                classes.push('opened');
            }


            return (
                <li title={_menuItem.title} className={classes.join(' ')} onClick={function (e) {
                    self.clickNaviItem(e, _menuItem);
                }}>
                    <a className={"fa fa-" + _menuItem.icon}> {this.props.showTitle ? _menuItem.title : ''}</a>
                </li>
            )
        },

        clickNaviItem(_e, _naviItem) {

            if (this.fold) {
                this.unfoldPanel();
            } else {
                // 한번더 클릭하면 패널을 닫는다.
                // 현재 열려있는 패널과 같은 naviItem을 클릭했을 때 닫는다.
                // 현재 열려있는 패널과 다른 naviItem을 클릭했을 때는 다른 패널이 열리도록 그대로 둔다.
                if (_naviItem.key === this.state.openedMenuKey) {
                    this.foldPanel();
                    this.setState({openedMenuKey: undefined});
                    return;
                }
            }

            this.setState({openedMenuKey: _naviItem.key});

            this.emit('NeedEquipTool', {
                "toolKey": _naviItem.equipToolKey
            }, _e, "MouseClick");
        },

        equipTool(_toolClass, _toolConfig, _toolKey) {

            if (typeof _toolClass === 'function') {
                this.setState({
                    equipTool: {class: _toolClass, config: _toolConfig, toolKey: _toolKey}
                });

                this.emit("NoticeMessage", {
                    title: "From PanelNavigation",
                    message: "Equiped tool[" + _toolKey + "]",
                    level: "success"
                });

            } else {
                this.setState({
                    equipTool: undefined
                });

                this.emit("NoticeMessage", {
                    title: "From PanelNavigation",
                    message: "Could't equip tool",
                    level: "error"
                });
            }

        },

        getMenuItemByToolKey(_key) {
            var groups = this.props.config.menuGroups;

            for (var groupIndex = 0; groupIndex < groups.length; groupIndex++) {
                var group = groups[groupIndex];

                for (var menuIndex = 0; menuIndex < group.menuItems.length; menuIndex++) {
                    var item = group.menuItems[menuIndex];

                    if (item.equipToolKey === _key) {
                        return item;
                    }
                }
            }

            return undefined;
        },

        toolRender(_tool) {

            var toolElement;
            var headElement;

            if (_tool !== null && typeof _tool === 'object') {
                toolElement = React.createElement(_tool.class, {config: _tool.config});

                var menuInfo = this.getMenuItemByToolKey(_tool.toolKey);

                headElement = <i className={"fa fa-" + menuInfo.icon}> {menuInfo.title}</i>;
            } else {
                toolElement = <div className='error'>
                    <span className='message'>Not Tool rendered</span>
                </div>;
                headElement = "unknown";
            }

            return (
                <div className='tool-wrapper'>
                    <div className='tool-head'>
                       { headElement }
                    </div>
                    <div className='tool-body'>
                        {toolElement}
                    </div>
                </div>
            );
        },

        componentDidMountByRoot() {
            this.foldPanel();


        },

        componentWillUpdate(_nextProps, _nextState) {
            if (_nextState.targetPanelItem !== null) {
                this.selectedNaviItemKey = _nextState.targetPanelItem.itemKey;
            }
        },

        render() {
            var rootClasses = [];
            rootClasses.push('ToolNavigation');
            rootClasses.push(this.props.position + '-wall');


            /* Styles */
            var rootStyle = {};

            var navigationAreaStyle = {};
            navigationAreaStyle.width = this.props.naviWidth;

            var panelAreaStyle = {};
            panelAreaStyle.width = this.props.panelWidth;

            var panelAreaResizeHookStyle = {};

            if (this.props.position === 'left') {
                panelAreaStyle.left = this.props.naviWidth;
                navigationAreaStyle.left = 0;
                rootStyle.left = 0;
                panelAreaResizeHookStyle.right = 2;
            } else if (this.props.position === 'right') {
                panelAreaStyle.right = this.props.naviWidth;
                navigationAreaStyle.right = 0;
                rootStyle.right = 0;
                panelAreaResizeHookStyle.left = 2;
            }

            navigationAreaStyle.fontSize = this.props.naviItemFontSize || 12;


            return (
                <div className={rootClasses.join(' ')} style={rootStyle}>

                    <div className="navigation" style={navigationAreaStyle}>
                        { this.props.config.menuGroups.map(this.naviItemGroupRender)}

                    </div>
                    <div className='tool-area' ref='toolArea' style={panelAreaStyle}>
                        <div className="resize-hook"
                            ref='resizeHook'
                            style={panelAreaResizeHookStyle}
                            onDragStart={this.startHookDrag}/>

                          { this.toolRender(this.state.equipTool) }
                    </div>
                </div>
            );
        }
    });

    module.exports = ToolNavigation;

})();
