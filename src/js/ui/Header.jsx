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

    var ReactSekeleton = React.createClass({
        render: function () {
            return (
                <ul className="horizontal-navigation pull-right">
                    <li>
                        <a>
                            <i className="fa fa-columns"></i>
                        </a>
                    </li>
                </ul>
            )
        }
    });


    module.exports = ReactSekeleton;

})();


