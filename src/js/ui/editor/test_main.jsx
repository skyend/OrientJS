var React = require('react');
document.addEventListener("DOMContentLoaded", function (event) {
    require("./test_main.less");
    var ToolkitMenuConfig = require('../../../config/ToolkitMenuConfig.json');
    var ToolkitMenu = require('../panel/ToolkitMenu.jsx');
    var ElementNavigator = require('../panel/ElementNavigator.jsx');
    var TestVitualdom = React.createClass({
        vController: null,
        componentDidMount: function () {
            var PageEditor = require("./PageEditor");
            var editor = new PageEditor(document.getElementById('screen'), "/BuilderUI/design/design.html",this.refs.navigator);
        },
        render: function () {
            console.log(ToolkitMenuConfig);
            return (
                <div>
                    <div id="ToolkitMenu"><ToolkitMenu items={ToolkitMenuConfig}/></div>
                    <div id='screen'></div>
                    <div id="navigator">
                        <ElementNavigator ref="navigator"/>
                    </div>
                </div>
            )
        }
    });
    React.render(<TestVitualdom/>, document.getElementsByTagName('body')[0]);
});