require('./style/builder.less');
var React = require("react");
var $ = require('jquery');
$(document).ready(function () {
    console.log("ready!!");
    var header = require("./js/header.jsx");
    var headers = React.createClass({
        render: function () {
            return (
                <ul className="nav">
                    ddffdffdfdfsfasfdsfsf
                </ul>
            )
        }
    });
    //React.render(<headers />, document.body);
    React.render(<headers/>, document.getElementsByTagName('body')[0]);
    var sideMenu = require("./js/SideMenu.jsx");
    var customPanel = require("./js/CustomPanel.jsx");
    var editorPanel = require("./js/EditorPanel.jsx");
    var footerPanel = require("./js/FooterPanel.jsx");

    var ServiceBuilder = React.createClass({
        render: function () {
            return (
                <ul className="dddd">dsfsdfdsfsf</ul>
                //<div>
                //    <header className="navbar navbar-inverse navbar-fixed-top header">
                //        <headers />
                //    </header>
                //    <aside id="side-menu" className="nav side-menu">
                //        <sideMenu />
                //    </aside>
                //    <aside className="side-tab">
                //        <customPanel />
                //    </aside>
                //    <div className="center-viewport">
                //        <editorPanel />
                //    </div>
                //    <footer className="navbar-fixed-bottom footer">
                //        <footerPanel />
                //    </footer>
                //</div>
            )
        }
    });
    //React.render(<ServiceBuilder/>, document.getElementsByTagName('body')[0]);
});
