var $ =jQuery =  require('jquery');
document.addEventListener("DOMContentLoaded", function (event) {

    require('../../../node_modules/jquery.json-viewer/json-viewer/jquery.json-viewer');
    require('../../../node_modules/jquery.json-viewer/json-viewer/jquery.json-viewer.css');
    var React = require('react');
    var TestVitualdom = React.createClass({
        vController:null,
        componentDidMount: function () {
            document.getElementsByTagName('body').item(0).style.margin = "0px";
            var iframe = document.getElementById('iframe');
            iframe.addEventListener("load", function (event) {
                var contentDocument = this.contentDocument;
                require("bundle?lazy!./VDomController")(function (Controller) {
                    this.vController = new Controller();
                    this.vController.createVRoot(contentDocument.querySelectorAll('body').item(0));
                    console.log(JSON.stringify(this.vController.vroot.export()));
                    $('#json-renderer').jsonViewer(this.vController.vroot.export());
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
                    <pre id="json-renderer" style={{width:400,height:900,overflow:'auto',position:'absolute', top:0,left:800}}></pre>
                </div>
            )
        }
    });
    React.render(<TestVitualdom/>, document.getElementsByTagName('body')[0]);
});