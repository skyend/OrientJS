/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

require('../lib/passwordConverter');
require('./LoginService.less');

(function () {
    var React = require("react");
    var $ = require("jquery");
    var cookie = require('js-cookie');
    var sha1Hex = require('sha1-hex');
    var LoginService = React.createClass({

        getInitialState() {
            return {};
        },
        loginProcess: function () {
            var id = $('#log-id').val();
            var pass = $("input:password").passwordConverter()[0].pass[0].value;
            var encodingPass = sha1Hex(pass);
            console.log('id', id);
            console.log('pass', encodingPass);
            $("#login-button").html('<i class="fa fa-spinner fa-pulse"></i>');
            $.ajax({
                //url: "http://125.131.88.77:8081/restful/servicebulider/resoruce/login",
                url: "http://localhost:8080/restful/servicebulider/resoruce/login",
                method: "POST",
                data: JSON.stringify({user_id: id, password: encodingPass}),
                success: function (data) {
                    cookie.set('session_token', data.session_token);
                    $(".login-form-message").addClass('show success').text('Connecting...');
                    setTimeout(function () {
                        $("#login-form").submit();
                    }, 2000);
                },
                error: function (data) {
                    var result = JSON.parse(data.responseText);
                    $(".login-form-message").addClass('show error').text(result.message);
                    $(".main-login-form").addClass('swing');
                    setTimeout(function () {
                        $(".main-login-form").removeClass("swing");
                    }, 1000);
                    setTimeout(function () {
                        $("#login-button").html('<i class="fa fa-chevron-right"></i>');
                    }, 1000);
                }

            });
        },
        enterLoginProcess(evt){
            var self = this;
            if(evt.keyCode === 13){
                self.loginProcess();
            }
            console.log('enter')
        },
        registerProcess: function () {
            var reg_id = $('#reg_id').val();
            var reg_pass = $("input:password").passwordConverter()[1].pass[0].value;
            var reg_pass_conf = $("input:password").passwordConverter()[2].pass[0].value;
            var reg_email = $('#reg_email').val();
            var reg_fullName = $('#reg_fullName').val();
            var gender = $(':radio[name="gender"]:checked').val();
            var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
            if (!regex.test(reg_email)) {
                $(".login-form-message").addClass('show error').text('잘못된 메일 주소 입니다.');
                $(".main-login-form").addClass('swing');
                setTimeout(function () {
                    $(".main-login-form").removeClass("swing");
                }, 1000);
            } else {
                $("#login-form").submit();
            }
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
                    <div className="bokeh">
                        <div className="pos-detect-top-1"></div>
                        <div className="pos-detect-top-2"></div>
                        <div className="pos-detect-top-3"></div>
                        <div className="pos-detect-top-4"></div>
                        <div className="pos-detect-top-5"></div>
                        <div className="pos-detect-top-6"></div>
                        <div className="pos-detect-top-7"></div>
                        <div className="pos-detect-top-8"></div>
                        <div className="pos-detect-top-9"></div>


                        <div className="pos-detect-center-1"></div>
                        <div className="pos-detect-center-2"></div>
                        <div className="pos-detect-center-3"></div>
                        <div className="pos-detect-center-4"></div>
                        <div className="pos-detect-center-5"></div>
                        <div className="pos-detect-center-6"></div>
                        <div className="pos-detect-center-7"></div>
                        <div className="pos-detect-center-8"></div>
                        <div className="pos-detect-center-9"></div>


                        <div className="pos-detect-bottom-1"></div>
                        <div className="pos-detect-bottom-2"></div>
                        <div className="pos-detect-bottom-3"></div>
                        <div className="pos-detect-bottom-4"></div>
                        <div className="pos-detect-bottom-5"></div>
                        <div className="pos-detect-bottom-6"></div>
                        <div className="pos-detect-bottom-7"></div>
                        <div className="pos-detect-bottom-8"></div>
                        <div className="pos-detect-bottom-9"></div>

                        <div className="background-layer">
                            <div className="bubble-1"></div>
                            <div className="bubble-2"></div>
                            <div className="bubble-3"></div>
                            <div className="bubble-4"></div>
                            <div className="bubble-5"></div>
                            <div className="bubble-6"></div>
                            <div className="bubble-7"></div>
                            <div className="bubble-8"></div>
                            <div className="bubble-9"></div>
                        </div>

                        <div className="middleground-layer">
                            <div className="bubble-1"></div>
                            <div className="bubble-2"></div>
                            <div className="bubble-3"></div>
                            <div className="bubble-4"></div>
                            <div className="bubble-5"></div>
                            <div className="bubble-6"></div>
                            <div className="bubble-7"></div>
                            <div className="bubble-8"></div>
                            <div className="bubble-9"></div>

                        </div>

                        <div className="foreground-layer">
                            <div className="bubble-1"></div>
                            <div className="bubble-2"></div>
                            <div className="bubble-3"></div>
                            <div className="bubble-4"></div>
                            <div className="bubble-5"></div>
                            <div className="bubble-6"></div>
                            <div className="bubble-7"></div>
                            <div className="bubble-8"></div>
                            <div className="bubble-9"></div>
                        </div>
                    </div>
                    <div className="popup-logos">UI builder</div>
                    <div id="log-page">
                        <div className="text-center">
                            <div className="login-logo">Login</div>
                            <form id="login-form" className="login-form">
                                <div className="login-form-message"></div>
                                <div className="main-login-form">
                                    <div className="login-group">
                                        <div className="form-group">
                                            <input id="log-id" type="text" className="form-control" placeholder="id"/>
                                        </div>
                                        <div className="form-group" onKeyDown={this.enterLoginProcess}>
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
                                        <input type="button" onClick={this.viewForgotPass} id="forget-pass" value="클릭"/>
                                    </p>

                                    <p>새로운 계정 생성이 필요합니다.
                                        <input type="button" onClick={this.viewRegister} id="go-register" value="클릭"/>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div id="reg-page">
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
                                            <input type="password" className="form-control" id="reg-password-confirm" placeholder="confirm password"/>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" className="form-control" id="reg-email" placeholder="email"/>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" className="form-control" id="reg-fullName" placeholder="full name"/>
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
                    <div id="forgot-pass-page">
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
            )
        }
    });
    module.exports = LoginService;

})();
