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

        getInitialState() {
            return {};
        },
        loginProcess: function () {
            var id = $('#log-id').val();
            var pass = $('#log-password').val();
            $("#login-button").html('<i class="fa fa-spinner fa-pulse"></i>');
            if(id.length < 5){
                $(".login-form-message").addClass('show error').text('아이디는 4글자 이상입니다.');
            }else{
                $(".login-form-message").addClass('show success').text('Connecting...');
            }
        },
        registerProcess: function () {
            var reg_id = $('#reg_id').val();
            var reg_email = $('#reg_email').val();
            var reg_fullName = $('#reg_fullName').val();
            var gender = $(':radio[name="gender"]:checked').val();
        },
        forGotPassProcess: function () {
            var forgot_email = $('#forgot-email').val();
        },
        viewLogin: function () {
            $('#reg-page').hide();
            $('#forgot-pass-page').hide();
            $('#log-page').show();
            $('#log-id').focus();
        },
        viewRegister: function () {
            $('#log-page').hide();
            $('#forgot-pass-page').hide();
            $('#reg-page').show();
            $('#reg-id').focus();
        },
        viewForgotPass: function () {
            $('#log-page').hide();
            $('#reg-page').hide();
            $('#forgot-pass-page').show();
            $('#forgot-email').focus();
        },
        componentDidMount: function (e) {
            this.viewLogin();
            $("input:password").passwordConverter();
        },
        render: function () {
            return (
                <div id="index">
                    <div className="popup-logos">UI builder</div>
                    <div id="log-page">
                        <div className="screen">
                            <div className="text-center">
                                <div className="login-logo">Login</div>
                                <form id="login-form" className="login-form">
                                    <div className="login-form-message"></div>
                                    <div className="main-login-form">
                                        <div className="login-group">
                                            <div className="form-group">
                                                <input id="log-id" type="text" className="form-control" placeholder="id"/>
                                            </div>
                                            <div className="form-group">
                                                <input id="log-password" type="password" className="form-control" placeholder="password"/>
                                            </div>
                                            <div className="form-group form-group-checkbox">
                                                <input type="checkbox" id="remember"/>
                                                <label htmlFor="remember">remember</label>
                                            </div>
                                        </div>
                                        <button id="login-button" type="button" className="login-button" onClick={this.loginProcess}>
                                            <i className="fa fa-chevron-right"></i>
                                        </button>
                                    </div>
                                    <div className="etc-login-form">
                                        <p>패스워드를 잊어버렸어요.
                                            <input type="button" onClick={this.viewForgotPass} id="forget-pass" value="클릭!"/>
                                        </p>

                                        <p>새로운 계정 생성이 필요합니다.
                                            <input type="button" onClick={this.viewRegister} id="go-register" value="클릭!"/>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div id="reg-page">
                        <div className="screen">
                            <div className="text-center">
                                <div className="login-logo">Register</div>
                                <form id="login-form" className="login-form">
                                    <div className="login-form-message"></div>
                                    <div className="main-login-form">
                                        <div className="login-group">
                                            <div className="form-group">
                                                <input type="text" className="form-control" id="reg-id" placeholder="id"/>
                                            </div>
                                            <div className="form-group">
                                                <input type="password" className="form-control" id="reg-password" placeholder="password"/>
                                            </div>
                                            <div className="form-group">
                                                <input type="password" className="form-control" id="reg_password_confirm" placeholder="confirm password"/>
                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control" id="reg_email" placeholder="email"/>
                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control" id="reg_fullName" placeholder="full name"/>
                                            </div>
                                            <div className="form-group form-group-checkbox">
                                                <input type="radio" name="gender" id="male" value="male"/>
                                                <label htmlFor="male">Male </label>

                                                <input type="radio" name="gender" id="female" value="female"/>
                                                <label htmlFor="female">Female</label>
                                            </div>
                                            <div className="form-group form-group-checkbox">
                                                <input type="checkbox" id="agree"/>
                                                <label htmlFor="agree"><a href="#">약관</a>에 동의 합니다.</label>
                                            </div>
                                        </div>
                                        <button id="register-button" type="button" className="login-button" onClick={this.registerProcess}>
                                            <i className="fa fa-chevron-right"></i>
                                        </button>
                                    </div>
                                    <div className="etc-login-form">
                                        <p>이미 계정이 있으세요?
                                            <input type="button" onClick={this.viewLogin} id="go-login" value="네, 있습니다."/>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div id="forgot-pass-page">
                        <div className="screen">
                            <div className="text-center">
                                <div className="login-logo">forgot password</div>
                                <form id="login-form" className="login-form">
                                    <div className="login-form-message"></div>
                                    <div className="main-login-form">
                                        <div className="login-group">
                                            <div className="form-group">
                                                <input id="forgot-email" type="text" className="form-control" placeholder="email address"/>
                                            </div>
                                        </div>
                                        <button id="forgot-pass-button" type="button" className="login-button" onClick={this.forGotPassProcess}>
                                            <i className="fa fa-chevron-right"></i>
                                        </button>
                                    </div>
                                    <div className="etc-login-form">
                                        <p>로그인 하겠습니다.
                                            <input type="button" onClick={this.viewLogin} id="go-login" value="클릭!"/>
                                        </p>

                                        <p>새로운 계정 생성이 필요합니다.
                                            <input type="button" onClick={this.viewRegister} id="go-register" value="클릭!"/>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    });
    module.exports = LoginService;

})();
