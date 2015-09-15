/**
 * PanelNavigation.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */


var React = require("react");
var ToolNest = require('./ToolNest.jsx');

require('./VerticalToolNavigation.less');

var VerticalToolNavigation = React.createClass({
    mixins: [require('./reactMixin/EventDistributor.js')],
    getInitialState() {

        return {

            // toolWidthMode
            //   auto :
            //     property 로 정해진 width에 따라 지정
            //   manual :
            //     state 에 지정된 width에 따라 지정
            //   fitToMax :
            //     state 의 maxWidth 로 지정
            //     fitToMax 로 변경될 때는 resize이벤트가 발생하지 않는다.
            //
            toolWidthMode: "auto",

            // maxWidth
            //   UIService가 지정하는 최대로 넓혀질 수 있는 값
            maxWidth:0,

            // width
            //   사용자가 manual로 변경한 넓이 값
            width:0,

            // equipTool
            //   장비할 툴 오브젝트 UIService로 부터 equipTool 메소드를 호출당하여 변경된다.
            //equipTool : undefined
        }
    },


    resize(_width) {
        this.getDOMNode().style.width = _width + 'px';
    },

    foldTool() {
        //this.resize(this.props.naviWidth);
        //this.refs['toolArea'].getDOMNode().style.display = 'none';

        this.fold = true;

        this.setState({fold:true});

        this.emit('FoldTool', {width: this.props.naviWidth});
    },

    unfoldTool() {
        var width = this.props.naviWidth + this.props.toolWidth;
        //this.resize(width);

        //this.refs['toolArea'].getDOMNode().style.display = 'block';
        this.fold = false;
        this.setState({fold:false});

        this.emit('UnfoldTool', {width: width});

        console.log('unfold');
    },

    startHookDrag(e) {
        console.log('start drag');
    },



    clickNaviItem(_e, _naviItem) {

        if (this.fold) {
            this.unfoldTool();
        } else {
            // 한번더 클릭하면 패널을 닫는다.
            // 현재 열려있는 패널과 같은 naviItem을 클릭했을 때 닫는다.
            // 현재 열려있는 패널과 다른 naviItem을 클릭했을 때는 다른 패널이 열리도록 그대로 둔다.
            if (_naviItem.key === this.state.openedMenuKey) {
                this.foldTool();
                this.setState({openedMenuKey: undefined});
                return;
            }
        }

        this.setState({openedMenuKey: _naviItem.key});

        this.emit('RequestAttachTool', {
            "toolKey": _naviItem.equipToolKey,
            "where":this.__myRefByParent
        }, _e, "MouseClick");
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

    toggleFitToMax(){
        if( this.state.toolWidthMode === 'fitToMax' ){
            this.changeToolWidthMode( this.state.prevToolWidthMode );
        } else {
            this.changeToolWidthMode( "fitToMax" );
        }
    },

    changeToolWidthMode( _mode ){
        this.state.prevToolWidthMode = this.state.toolWidthMode;


        this.setState( { toolWidthMode : _mode } );

        if( _mode === 'fitToMax'){
            this.emit('SetToolFitToMax', {
                myRef: this._reactInternalInstance._currentElement.ref
            });
        } else if( this.state.prevToolWidthMode === 'fitToMax' ){

        }
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

    toolRender(_toolEgg, _toolWidth){
      if( typeof _toolEgg === 'function' ){
        return <ToolNest toolEgg={_toolEgg} width={_toolWidth}/>;
      } else {
        return (
          <div className='error'>
              <span className='message'>Not rendered a Tool</span>
          </div>
        );
      }
    },

    // 최종 root 가 마운트 되었을 때 tool을 접는다.
    componentDidMountByRoot() {
        this.foldTool();
    },


    render() {
        var rootClasses = [];
        rootClasses.push('VerticalToolNavigation');
        rootClasses.push(this.props.position + '-wall');


        /* Styles */
        var rootStyle = {};

        var navigationAreaStyle = {};
        var toolAreaStyle = {};


        var naviWidth;
        var toolWidth;

        if( this.state.fold ){
          rootStyle.overflow = 'hidden';
          rootStyle.width = this.props.naviWidth;
        } else {
          //rootStyle.overflow = 'visibility';
          rootStyle.width = this.props.naviWidth + this.props.toolWidth;
        }

        switch( this.state.toolWidthMode ){
          case "auto" :
            naviWidth = this.props.naviWidth;
            toolWidth = this.props.toolWidth;
            break;
          case "manual" :
            naviWidth = this.props.naviWidth;
            toolWidth = this.state.width - naviWidth;
            break;
          case "fitToMax" :
            naviWidth = this.props.naviWidth;
            toolWidth = this.state.maxWidth - naviWidth;
            break;
        }

        navigationAreaStyle.width = naviWidth;
        toolAreaStyle.width = toolWidth;

        var toolAreaResizeHookStyle = {};

        if (this.props.position === 'left') {
            toolAreaStyle.left = this.props.naviWidth;
            navigationAreaStyle.left = 0;
            rootStyle.left = 0;
            toolAreaResizeHookStyle.right = 2;
        } else if (this.props.position === 'right') {
            toolAreaStyle.right = this.props.naviWidth;
            navigationAreaStyle.right = 0;
            rootStyle.right = 0;
            toolAreaResizeHookStyle.left = 2;
        }

        navigationAreaStyle.fontSize = this.props.naviItemFontSize || 12;


        return (
            <div className={rootClasses.join(' ')} style={rootStyle}>

                <div className="navigation" style={navigationAreaStyle}>
                    { this.props.config.menuGroups.map(this.naviItemGroupRender)}

                </div>
                <div className='tool-area' ref='toolArea' style={toolAreaStyle}>
                    <div className="resize-hook"
                        ref='resizeHook'
                        style={toolAreaResizeHookStyle}
                        onDragStart={this.startHookDrag}/>
                      { this.toolRender(this.state.toolEgg, toolWidth) }
                </div>
            </div>
        );
    }
});

module.exports = VerticalToolNavigation;
