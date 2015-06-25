require('./style/builder.less');
var React = require('react');
var $ = require('jquery');
$(document).ready(function () {

    var header = require("./js/header.jsx");
    var sideMenu = require("./js/SideMenu.jsx");
    var customPanel = require("./js/CustomPanel.jsx");
    var editorPanel = require("./js/EditorPanel.jsx");
    var footerPanel = require("./js/FooterPanel.jsx");

    var ServiceBuilder = React.createClass({
        render: function () {
            return (
                <div>
                    <header className="navbar navbar-inverse navbar-fixed-top header">
                        <header />
                    </header>
                    <aside id="side-menu" className="nav side-menu">
                        <sideMenu />
                    </aside>
                    <aside className="side-tab">
                        <customPanel />
                    </aside>
                    <div className="center-viewport">
                        <editorPanel />
                    </div>
                    <footer className="navbar-fixed-bottom footer">
                        <footerPanel />
                    </footer>
                </div>
            )
        }
    });
    React.render(<ServiceBuilder/>, document.getElementsByTagName('body')[0]);
});
