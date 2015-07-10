var React = require('react');
document.addEventListener("DOMContentLoaded", function (event) {

    var ElementNavigator = require('../ui/panel/ElementNavigator.jsx');
    var TestVitualdom = React.createClass({
        vController: null,
        componentDidMount: function () {
            document.getElementsByTagName('body').item(0).style.margin = "0px";
            var iframe = document.getElementById('iframe');
            var test = this;
            iframe.addEventListener("load", function (event) {
                var contentDocument = this.contentDocument;
                require("bundle?lazy!./VDomController")(function (Controller) {
                    test.vController = new Controller();
                    test.vController.createVRoot(contentDocument.querySelectorAll('body').item(0));
                    test.refs.navigator.setState(test.vController.vroot.export());

                });

            });
            iframe.src = "/BuilderUI/design/design.html";

        },
        render: function () {
            return (
                <div>
                    <div id='screen'>
                        <iframe id="iframe" style={{width:800,height:900}} src="/BuilderUI/design/design.html"></iframe>
                    </div>
                    <div style={{overflow:'auto',position:'absolute', top:0,left:800}}>
                        <ElementNavigator ref="navigator"/>
                    </div>
                </div>
            )
        }
    });
    React.render(<TestVitualdom/>, document.getElementsByTagName('body')[0]);
});