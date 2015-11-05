/**
 */
require("./ElementNavigator.less");
var React = require('react');

var ElementNavigatorIconCss = {
    'folding': 'fa fa-play',
    'element': 'element fa fa-code'
}

var ENNode = React.createClass({
    getInitialState: function () {
        return {
            collapse: false,
            childCount: 0
        }
    },
    toggleFolding: function (e) {
        this.state.collapse = !this.state.collapse;
        this.setState(this.state);
    },
    componentWillMount: function () {
        var childs = this.props.childs;
        this.state.childCount = childs !== null ? childs.length : 0;
        if (this.props.collapse !== undefined)
            this.state.collapse = this.props.collapse;
        this.setState(this.state);

    },
    render: function () {
        var childs = this.props.childs;
        var childsNodes = [];
        if (!this.state.collapse || this.childCount > 0) {
            childs.forEach(function (childNode) {
                childsNodes.push(<ENNode name={childNode.name} childs={childNode.childs}/>);
            });
        }
        return (

            <li className={this.state.collapse?'collapse':''}>
                {this.state.childCount > 0 ? <i className="folding fa fa-play" onClick={this.toggleFolding}></i> : null}
                <i className="element fa fa-code">{this.props.name}</i>
                {childsNodes.length > 0 ? <ul>{childsNodes}</ul> : null}
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
