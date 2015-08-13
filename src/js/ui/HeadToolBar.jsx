/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

require('../lib/passwordConverter');
require('./HeadToolBar.less');

(function () {
    var React = require("react");
    var $ = require("jquery");
    var HeadToolBar = React.createClass({
        mixins: [require('./reactMixin/EventDistributor.js')],

        setUserInfo: function (id) {
            console.log('setUserInfo');
        },

        loginFormActivator: function(val){
            if(val === 'open') {
                $(".login-form").slideUp().slideToggle("fast");
            }else if(val === 'close'){
                $(".login-form").slideDown().slideToggle("fast");
            }
        },
        componentDidMount: function () {
            var self = this;

        },
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
                                <i className="fa fa-user"> ion</i>
                            </a>
                            <div id="loginForm" className="login-form">
                                userinfo
                            </div>
                        </li>
                    </ul>
                </header>
            )
        }
    });
    module.exports = HeadToolBar;

})();
