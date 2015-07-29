/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    require('./HeadToolBar.less');
    var React = require("react");

    var HeadToolBar = React.createClass({
        render: function () {
            return (
                <header id="ui-header">
                    <ul className="navigation">
                        <li>
                            <a>
                                <i className="fa fa-columns"></i>
                            </a>
                        </li>
                        <li>
                            <a className="user-info">
                                <i className="fa fa-user"> i-on</i>
                            </a>
                        </li>
                    </ul>
                </header>
            )
        }
    });

    module.exports = HeadToolBar;

})();
