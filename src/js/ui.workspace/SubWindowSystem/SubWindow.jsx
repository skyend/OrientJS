require('./SubWindow.less');

var React = require('react');
var ToolNest = require('../ToolNest.jsx');

var SubWindowSystem = React.createClass({
    mixins: [require('../reactMixin/EventDistributor.js')],

    getDefaultProps() {
        /**
         최초 초기화 State를 위함
         */
        return {
            x: 0,
            y: 0,
            width: 300,
            height: 200,
            zOrder: 0,
            baseZOrder: 10,


            title: '',
            descType: '', // text / toolEgg
            text: '',
            toolEgg: null
        };
    },

    getInitialState() {
        return {
            theme: 'black',

            fullScreen: false,
            minimalized: false,

            tabOrder: 0,
            zOrder: 0,
            baseZOrder: 10,

            x: 0,
            y: 0,

            width: 200,
            height: 150
        };
    },

    closeMe() {
        window.app.ui.stopGlobalDrag();
        this.emit("CloseMe", {
            myRef: this._reactInternalInstance._currentElement.ref
        });
    },

    toggleMinimalize() {

        if (this.refs['window-body'].getDOMNode().style.display === 'block') {
            this.setState({minimalized: true});

            this.emit("MinimalizedMe", {
                myRef: this._reactInternalInstance._currentElement.ref
            });
        } else {
            this.setState({minimalized: false});

            this.emit("NormalizedMe", {
                myRef: this._reactInternalInstance._currentElement.ref
            });
        }
    },

    toggleFullScreen() {

        if (this.state.fullScreen) {
            this.setState({fullScreen: false});
        } else {
            this.setState({fullScreen: true});
        }

    },

    styleProcFullScreen(_style, _windowBodyStyle) {

        if (this.state.fullScreen) {
            _style.width = 'auto';
            _style.height = 'auto';
            _style.left = "0px";
            _style.right = "0px";
            _style.top = "0px";
            _style.bottom = "0px";

            _windowBodyStyle.left = "0px";
            _windowBodyStyle.right = "0px";
            _windowBodyStyle.top = "25px";
            _windowBodyStyle.bottom = "0px";
        } else {

            _style.width = this.state.width + 'px';
            _style.height = this.state.height + 'px';
            _style.left = this.state.x + 'px';
            _style.top = this.state.y + 'px';
        }
    },

    styleProcMinimalize(_style, _windowBodyStyle) {
        if (this.state.fullScreen) return;

        if (this.state.minimalized) {
            _windowBodyStyle.display = 'none';
            _style.height = 'auto';
        } else {
            _windowBodyStyle.display = 'block';
            _windowBodyStyle.height = (this.state.height - 25) + 'px';
        }
    },

    /////////////////////////////////////
    // Drag Routines
    ///
    onMouseDownToHeader(_e) {
        console.log(_e.nativeEvent.target);
        if (!this.state.fullScreen) {

            // GlobalDrag 자원 획득( 획득한 자원은 반드시 반환하고 상태를 종료 해주어야 한다.)
            app.ui.occupyGlobalDrag(this, true);
            app.ui.enableGlobalDrag();
            app.ui.toMouseDawn();
        }
    },

    onGlobalDragStartFromUI(_e) {
    },

    onGlobalDragFromUI(_e) {

        if (typeof this.prevMouseX !== 'undefined') {
            var selfDom = this.getDOMNode();
            var ymoveStep = this.prevMouseY - _e.clientY;
            var xmoveStep = this.prevMouseX - _e.clientX;

            this.setState({x: this.state.x - xmoveStep, y: this.state.y - ymoveStep});
        }

        this.prevMouseY = _e.clientY;
        this.prevMouseX = _e.clientX;
    },

    onGlobalDragStopFromUI(_e) {

        /* Global Drag 자원을 자동으로 반환한다 */

        this.prevMouseY = undefined;
        this.prevMouseX = undefined;

        this.focus();
    },
    ///
    // Drag Routines End
    /////////////////////////////////////

    focus() {
        this.emit("FocusedMe", {
            myRef: this._reactInternalInstance._currentElement.ref
        });
    },

    componentDidMount() {

        // 최초 마운트 후 입력된 Properties를 state로 반영한다.
        this.setState({
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height,
            zOrder: this.props.zOrder,
            baseZOrder: this.props.baseZOrder
        });
    },

    renderWindowDesc(){
        switch (this.props.descType) {
            case "text":
                return this.props.text;
            case "toolEgg":
                return <ToolNest toolEgg={this.props.toolEgg} width={this.props.width} height={this.props.height}/>;
        }
    },

    render() {

        var classes = ['SubWindow', this.state.theme];
        var styles = {};
        var windowBodyStyle = {};

        this.styleProcFullScreen(styles, windowBodyStyle);
        this.styleProcMinimalize(styles, windowBodyStyle);
        styles.zIndex = this.state.zOrder + this.state.baseZOrder;

        return (
            <div className={classes.join(' ')} style={styles} onMouseDown={this.focus}>
                <div className='head-title-bar' onMouseDown={this.onMouseDownToHeader} ref='window-head'>
                    <div className='title'>
                        { this.props.title }
                    </div>
                    <div className='left-area'>
                        <ul>
                            <li onClick={this.closeMe}>
                                <i className='fa fa-times'></i>
                            </li>
                            <li onClick={this.toggleFullScreen}>
                                <i className={ this.state.fullScreen ? 'fa fa-square-o' : 'fa fa-plus'}></i>
                            </li>
                            <li onClick={this.toggleMinimalize}>
                                <i className='fa fa-minus'></i>
                            </li>
                        </ul>
                    </div>
                    <div className='right-area'>

                    </div>
                </div>
                <div className='window-description' ref='window-body' style={windowBodyStyle}>
                    {this.renderWindowDesc()}
                </div>
            </div>
        );
    }
});

module.exports = SubWindowSystem;
