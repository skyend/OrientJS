/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function(){

    var React = require("react");

    var Header = React.createClass({
        render: function () {
            return (
                <header id="ui-header">
                    <ul class="navigation">
                        <li>
                            <a>
                                <i class="fa fa-columns"></i>
                            </a>
                        </li>
                        <li>
                            <a class="user-info">
                                <i class="fa fa-user"> i-on</i>
                            </a>
                        </li>
                    </ul>
                </header>
            )
        }
    });

    module.exports = Header;

})();


