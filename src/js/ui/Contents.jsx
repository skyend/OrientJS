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

    var Contents = React.createClass({
        render: function () {
            return (
                <section id="ui-contents">
                    <div className="contents-tab">
                        <ul className="tab-area">
                            <li>
                                <span>index.html</span>
                            </li>
                            <li>
                                <span>main.html</span>
                            </li>
                        </ul>
                    </div>
                    <div className="contents-area">
                        <iframe src="//getbootstrap.com/examples/non-responsive/"></iframe>
                    </div>
                </section>
            )
        }
    });

    module.exports = Contents;

})();


