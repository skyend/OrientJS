/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

require('../lib/PasswordConverter');
require('./LoginService.less');

(function () {
    var React = require("react");
    var $ = require("jquery");
    var cookie = require('js-cookie');

    var LoginService = React.createClass({

        getInitalState() {
            return {};
        },
        loginProcess: function () {
            var id = $('#id').val();
            var password = $('#password').val();
            cookie.set('id', id);
            cookie.set('password', password);
            cookie.set('sessionKey', 'asDkdjfk12de4Qiekjfi');
            $("#login-form").submit();
        },
        inputEventDeclaration: function (e) {
            var self = this;
            $("#username").on('keyup', function (e) {
                e.preventDefault();
                if (e.keyCode === 13) {
                    $('#passwordConverter').focus();
                }
            });
            $("#passwordConverter").on('keyup', function (e) {
                if (e.keyCode === 13) {
                    self.loginProcess();
                }
            });
            $(".login-button").on('click', function (e) {
                self.loginProcess();
            });
        },
        initLogin: function (e) {
            $("#username").focus();
            $("#passwordConverter").passwordConverter();
            this.inputEventDeclaration(e);
        },
        componentDidMount: function (e) {
            this.initLogin();
        },
        render: function () {
            return (
                <div id="login-page">
                    <div className="screen">
                        <div className="popup-logos">UI builder</div>
                        <div className="text-center">
                            <div className="login-logo">Login</div>
                            <form id="login-form" className="login-form">
                                <div className="login-form-message"></div>
                                <div className="main-login-form">
                                    <div className="login-group">
                                        <div className="form-group">
                                            <input type="id" className="form-control" id="username" placeholder="username"/>
                                        </div>
                                        <div className="form-group">
                                            <input id="passwordConverter" type="text" className="form-control" placeholder="password"/>
                                        </div>
                                        <div className="form-group form-group-checkbox">
                                            <input type="checkbox" id="remember"/>
                                            <label htmlFor="remember">remember</label>
                                        </div>
                                    </div>
                                    <button className="login-button">
                                        <i className="fa fa-chevron-right"></i>
                                    </button>
                                </div>
                                <div className="etc-login-form">
                                    <p>forgot your password? <a href="#">click here</a></p>

                                    <p>new user? <a href="#">create new account</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    });
    module.exports = LoginService;

})();
