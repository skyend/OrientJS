require('./style/builder.less');
var React = require("react");
var $ = require('jquery');
$(document).ready(function () {
    console.log("ready!!");

    var Headers = require("./js/Headers.jsx");
    var SideMenu = require("./js/SideMenu.jsx");
    var CustomPanel = require("./js/CustomPanel.jsx");
    var EditorPanel = require("./js/EditorPanel.jsx");
    var FooterPanel = require("./js/FooterPanel.jsx");

    var ServiceBuilder = React.createClass({
        render: function () {
            return (
                <div>
                    <header className="navbar navbar-inverse navbar-fixed-top header">
                        <Headers />
                    </header>
                    <aside id="side-menu" className="nav side-menu">
                        <SideMenu />
                    </aside>
                    <aside className="side-tab">
                        <CustomPanel />
                    </aside>
                    <div className="center-viewport">
                        <EditorPanel />
                    </div>
                    <footer className="navbar-fixed-bottom footer">
                        <FooterPanel />
                    </footer>
                </div>
            )
        }
    });
    React.render(<ServiceBuilder/>, document.getElementsByTagName('body')[0]);
});
