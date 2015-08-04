/**
 * IFrameStage (react)
 * IFrame을 조작하고 내부 인터페이스를 구현함
 *
 * Requires: IFrameStage.less
 */

var React = require("react");
require('./IFrameStage.less');

var IFrameStage = React.createClass({
    getInitialState(){
        return {
          src:"about:blank"
        };
    },
    getIframeInnerWindow(){
        var iframeDom = this.refs['iframe'].getDOMNode();

        return iframeDom.contentWindow || iframeDom;
    },

    getIFrameInnerDoc(){
        var innerWindow = this.getIframeInnerWindow();
        return innerWindow.contentDocument || innerWindow.document;
    },

    getInnerBody(){
        return this.getIFrameInnerDoc().querySelector('body');
    },

    getInnerHead(){
        return this.getIFrameInnerDoc().querySelector('head');
    },

    writeContentsToBody( _html, _styles ){
        this.getInnerBody().innerHTML = _html;
        this.getInnerHead().innerHTML = '<style>'+ _styles +'</style>';
    },

    componentDidMount(){

    },

    render() {
        var classes = [];
        classes.push('IFrameStage');
        classes.push('theme-default');
        classes.push( this.props.color );
        classes.push( this.props.size );

        return (
            <div className={ classes.join(' ') } style={ { width: this.props.width, height: this.props.height } } >
                <iframe ref='iframe' src={this.state.src} />
            </div>
        );
    }
});

module.exports = IFrameStage;
