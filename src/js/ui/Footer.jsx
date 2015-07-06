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

    var Footer = React.createClass({
        render: function () {
            return (
                <footer id="ui-footer">
                    <ul className="inventory">
                        <li className="item-left">
                            <a><i className="fa fa-info-circle"></i></a>
                        </li>
                        <li className="item-right">
                            <a>UTF-8</a>
                        </li>
                        <li className="item-right">
                            <a>HTML</a>
                        </li>
                        <li className="item-right">
                            <a>EDIT</a>
                        </li>
                    </ul>
                </footer>
            )
        }
    });


    module.exports = Footer;

})();
