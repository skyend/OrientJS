/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

require('../lib/PasswordConverter');
require('./HeadToolBar.less');

(function () {
    var React = require("react");
    var $ = require("jquery");
    var HeadToolBar = React.createClass({
        mixins: [require('./reactMixin/EventDistributor.js')],

        setUserInfo: function (id) {
            $('.user-info').html('<i class="fa fa-user"> ' + id + '</i>');
            $('.user-info').off("click");
            console.log('setUserInfo');
        },

        loginFormActivator: function(val){
            if(val === 'open') {
                $(".login-form").slideUp().slideToggle("fast");
            }else if(val === 'close'){
                $(".login-form").slideDown().slideToggle("fast");
            }
        },
        loginProcess: function () {
            var id = $('#id').val();
            var password = $('#password').val();
            this.emit("Login", {
                id: id,
                password: password
            });
        },
        componentDidMount: function () {
            var self = this;
            $("#passwordConverter").passwordConverter();
            $(".login-form").hide();
            $('.user-info').on('click', function () {
                $(".login-form").slideToggle('fast', function () {
                    $('#id').focus();
                });
            });
            $("#login").on('click', function () {
                self.loginProcess();
            });
            $("#id").on('keyup', function (e) {
                if (e.keyCode === 13) {
                    $('#passwordConverter').focus();
                }
            });
            $("#passwordConverter").on('keyup', function (e) {
                if (e.keyCode === 13) {
                    self.loginProcess();
                }
            });

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
                                <i className="fa fa-sign-in"> Login</i>
                            </a>

                            <form id="loginForm" className="login-form">
                                <input id="id" type="text" placeholder="ID" className="login-input"/>
                                <input id="passwordConverter" type="text" placeholder="PASSWORD" className="login-input"/>
                                <input id="login" type="button" className="login-button" value="Login" tabindex="3"/>
                                <span className="remember">&nbsp;&nbsp;&nbsp;Remember?<input type="checkbox" className="checkbox"/></span>

                                <div className="lost-password">
                                    <a>비밀번호가 기억나지 않으세요?</a>
                                </div>
                            </form>
                        </li>
                    </ul>
                </header>
            )
        }
    });
    module.exports = HeadToolBar;

})();
