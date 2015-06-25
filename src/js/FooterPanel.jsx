module.exports = function(){
    var reactjs = require('react');
    return reactjs.createClass({
        render: function () {
            return (
                <ul className="item-list">
                    <li className="item-right">
                        <a>UTF-8</a>
                    </li>
                    <li className="item-right">
                        <a>JSON</a>
                    </li>
                    <li className="item-left">
                        <a><i className="glyphicon glyphicon-info-sign"></i></a>
                    </li>
                </ul>
            )
        }
    });
};