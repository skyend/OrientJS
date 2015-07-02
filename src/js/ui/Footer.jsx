/**
 * Created by hanjinwoong on 15. 7. 2..
 */

/**
 * Footer.jsx
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
                <ul className="item-list">
                    <li className="item-right">
                        <a>UTF-8</a>
                    </li>
                    <li className="item-right">
                        <a>JSON</a>
                    </li>
                </ul>
            )
        }
    });


    module.exports = ReactSekeleton;

})();
