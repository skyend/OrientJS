/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

var $ = require('jquery');

(function () {

    var React = require("react");
    var Contents = React.createClass({

        componentDidMount(){
            var before_select_id = '#index-iframe';
            var now_select_id;

            $('.tab-area > li').on('click', function (e) {
                now_select_id = '#' + e.target.id + '-iframe';
                if (now_select_id != before_select_id) {
                    $(before_select_id).hide();
                    $(now_select_id).show();
                    before_select_id = now_select_id;
                } else {
                    $(now_select_id).show();
                    before_select_id = now_select_id;
                }
            });
        },

        render: function () {
            return (
                <section id="ui-contents">
                    <div className="contents-tab">
                        <ul className="tab-area">
                            <li id="index">
                                index
                            </li>
                            <li id="main">
                                main
                            </li>
                        </ul>
                    </div>
                    <div className="contents-area">
                        <iframe id="index-iframe" src="//getbootstrap.com/examples/non-responsive/"></iframe>
                        <iframe id="main-iframe" src="//getbootstrap.com/examples/carousel/" style={{display: "none"}}></iframe>
                    </div>
                </section>
            )
        }
    });

    module.exports = Contents;

})();


