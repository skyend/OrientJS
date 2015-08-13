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
require('js-cookie');

(function () {
    var React = require("react");
    var $ = require("jquery");
    var cookie = require('js-cookie');
    var HeadToolBar = React.createClass({
        mixins: [require('./reactMixin/EventDistributor.js')],

        setUserInfo: function () {
            $(".user-info > i").html(" "+cookie.get('id'));
        },

        loginFormActivator: function(val){
            if(val === 'open') {
                $(".login-form").slideUp().slideToggle("fast");
            }else if(val === 'close'){
                $(".login-form").slideDown().slideToggle("fast");
            }
        },
        componentDidMount: function () {
            this.setUserInfo();
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
                                <i className="fa fa-user"></i>
                            </a>
                        </li>
                    </ul>
                </header>
            )
        }
    });
    module.exports = HeadToolBar;

})();
