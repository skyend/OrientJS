module.exports = function(){
    var React = require("react/lib/reactWithAddons");
    return React.createClass({
        render: function () {
            return (
                <ul className="nav navbar-right">
                    <li>
                        <a>
                            <i className="fa fa-columns"></i>
                        </a>
                    </li>
                </ul>
            )
        }
    });
};