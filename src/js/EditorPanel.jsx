module.exports = function () {
    var React = require("react/lib/reactWithAddons");
    return React.createClass({
        render: function () {
            return (
                <div className="contents-wrapper">
                    <iframe className="contents-frame" id="example-sortable" src="data:text/html;"></iframe>
                </div>
            )
        }
    });
};