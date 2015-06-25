module.exports = function () {
    var reactjs = require('react');
    return reactjs.createClass({
        render: function () {
            return (
                <div className="contents-wrapper">
                    <iframe className="contents-frame" id="example-sortable" src="data:text/html;"></iframe>
                </div>
            )
        }
    });
};