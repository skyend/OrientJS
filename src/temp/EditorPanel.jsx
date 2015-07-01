var React = require("react");
module.exports = React.createClass({
    render: function () {
        return (
            <div className="contents-wrapper">
                <iframe className="contents-frame" id="example-sortable" src="data:text/html"></iframe>
            </div>
        )
    }
});