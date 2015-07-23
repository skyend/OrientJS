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
    require('./PanelNavigation.less');

    var PanelNavigation = React.createClass({
        mixins:[ require('./reactMixin/EventDistributor.js') ],
        getInitialState(){
          return {
              targetPanelItem: null,
              panelElementInstance : null
          }
        },
        clickNaviItem(_e, _naviItem){

            if (this.fold) {
                this.unfoldPanel();
            } else {
                // 한번더 클릭하면 패널을 닫는다.
                // 현재 열려있는 패널과 같은 naviItem을 클릭했을 때 닫는다.
                // 현재 열려있는 패널과 다른 naviItem을 클릭했을 때는 다른 패널이 열리도록 그대로 둔다.
                if( _naviItem.id === this.state.targetPanelItem.id ){
                    this.foldPanel();
                    this.setState({targetPanelItem:null});
                    return;
                }
            }
            this.emit('DisplayPanel', _naviItem, _e, "MouseClick");
        },

        resize(_width){
            this.getDOMNode().style.width = _width + 'px';

            //this.props.onResize(_width);
        },

        foldPanel(){
            this.resize(this.props.naviWidth);
            this.refs['panelArea'].getDOMNode().style.display = 'none';
            this.fold = true;

            this.emit('FoldPanel', {width: this.props.naviWidth});
        },

        unfoldPanel(){
            var width = this.props.naviWidth + this.props.panelWidth;
            this.resize(width);
            this.refs['panelArea'].getDOMNode().style.display = 'block';
            this.fold = false;

            this.emit('UnfoldPanel', {width:width});
        },

        startHookDrag(e){
            console.log('start drag');
        },

        naviItemGroupRender( _group ){
            var items = _group.items;

            return (
                <ul className="group">
                    { items.map(this.naviItemRender ) }
                </ul>);
        },

        naviItemRender(_naviItem){
            var self = this;
            var classes = [];

            if( this.props.verticalText ){
                classes.push('vertical-text-display');
            }

            // 현재 열리게될 패널이
            if( this.state.targetPanelItem !== null ) {
                if (this.state.targetPanelItem.id === _naviItem.id) {
                    classes.push('opened');
                }
            }

            return (
                <li title={_naviItem.title} className={classes.join(' ')} onClick={function(e){ self.clickNaviItem(e, _naviItem); }}>
                    <a className={"fa fa-"+_naviItem.icon}> {this.props.showTitle?_naviItem.title:''}</a>
                </li>
            )
        },

        panelAreaRender(_panelItem, _panelElement) {
            if( _panelItem === null ) return "Not Rendered Panel";

            if( typeof _panelElement.type !== 'function' ){
                return "Not exists Panel Element";
            }

            return(
                <div className='panel-wrapper'>
                    <div className='panel-head'>
                        <i className={"fa fa-"+_panelItem.icon}> {_panelItem.title}</i>
                    </div>
                    <div className='panel-body' ref='panel-mount-area'>
                        {_panelElement}
                    </div>
                </div>
            );
        },

        componentDidMount(){
            this.foldPanel();
        },

        componentWillUpdate( _nextProps, _nextState ){
            if( _nextState.targetPanelItem !== null){
                this.selectedNaviItemKey = _nextState.targetPanelItem.itemKey;
            }
        },

        render() {
            var rootClasses = [];
            rootClasses.push('PanelNavigation');
            rootClasses.push(this.props.position+'-wall');


            /* Styles */
            var rootStyle = {};

            var navigationAreaStyle = {};
            navigationAreaStyle.width = this.props.naviWidth;

            var panelAreaStyle = {};
            panelAreaStyle.width = this.props.panelWidth;

            var panelAreaResizeHookStyle = {};

            if( this.props.position === 'left' ){
                panelAreaStyle.left = this.props.naviWidth;
                navigationAreaStyle.left = 0;
                rootStyle.left = 0;
                panelAreaResizeHookStyle.right = 2;
            } else if( this.props.position === 'right') {
                panelAreaStyle.right = this.props.naviWidth;
                navigationAreaStyle.right = 0;
                rootStyle.right = 0;
                panelAreaResizeHookStyle.left = 2;
            }

            navigationAreaStyle.fontSize = this.props.naviItemFontSize || 12;

            return (
                <aside className={rootClasses.join(' ')} style={rootStyle}>

                    <div className="navigation" style={navigationAreaStyle}>
                        { this.props.naviItemGroups.map( this.naviItemGroupRender )}

                    </div>
                    <div className='panel-area' ref='panelArea' style={panelAreaStyle}>
                        <div className="resize-hook"
                             ref='resizeHook'
                             style={panelAreaResizeHookStyle}
                             onDragStart={this.startHookDrag}/>

                        { this.panelAreaRender(this.state.targetPanelItem, this.state.panelElementInstance) }
                    </div>
                </aside>
            );
        }
    });

    module.exports = PanelNavigation;

})();


