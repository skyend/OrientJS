/**
 */
require("./ElementNavigator.less");
var React = require('react');

var ElementNavigatorIconCss = {
    'folding': 'fa fa-play',
    'element': 'element fa fa-code'
}

var ENNode = React.createClass({
    getInitialState : function(){
        return {isCollapse : false}
    },
    toggleFolding: function (e) {
        this.state.isCollapse=!this.state.isCollapse;
        this.setState(this.state);
    },
    componentWillMount: function(){
        var childs = this.props.childs;
        var isFolding = childs !== null && childs.length > 0;
    },
    render: function () {
        var childs = this.props.childs;
        var isFolding = childs !== null && childs.length > 0;
        var childsNodes = [];
        if (isFolding !== null) {
            childs.forEach(function (childNode) {
                childsNodes.push(<ENNode name={childNode.name} childs={childNode.childs}/>);
            });
        }
        return (
            <li className={this.state.isCollapse?'collapse':''}>
                {isFolding !== null ? <i className="folding fa fa-play" onClick={this.toggleFolding}></i> : null}
                <i className="element fa fa-code">{this.props.name}</i>
                {!this.state.isCollapse ? <ul>{childsNodes}</ul> : null}
            </li>
        )
    }
});

var _ = React.createClass({

    render: function () {
        console.log(this.state);
        var dom = this.state === null ? null : this.state.dom;
        var childs = dom === null ? [] : dom.childs;
        var rootNode = null;
        if (dom !== null) {
            rootNode = <ENNode name={dom.name} childs={dom.childs}/>;
            console.log(dom.childs.length);
        }
        return (
            <div id="element_navigator">
                <ul id="nav_root">
                    {rootNode}
                </ul>
            </div>
        );
    }
});
module.exports = _;
