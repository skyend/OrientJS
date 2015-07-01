var React = require("react");
module.exports = React.createClass({
    render: function () {
        return (
            <nav class="menu">
                <ul id="menu-list" className="menu-list">
                    <li>
                        <a id="menu-1">
                            <i className="glyphicon glyphicon-th"></i>
                        </a>
                    </li>
                    <li>
                        <a id="menu-2">
                            <i className="fa fa-desktop"></i>
                        </a>
                    </li>
                </ul>
                <ul className="menu-list">
                    <li>
                        <a>
                            <i className="fa fa-folder-open"></i>
                        </a>
                    </li>
                    <li>
                        <a>
                            <i className="fa fa-search"></i>
                        </a>
                    </li>
                </ul>
            </nav>
        )
    }
});