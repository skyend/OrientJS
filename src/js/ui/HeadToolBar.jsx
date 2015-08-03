/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    require('../lib/iPassword');
    require('./HeadToolBar.less');
    var React = require("react");
    var $ = require("jquery");
    var HeadToolBar = React.createClass({
        componentDidMount(){
            var status = true;
            $("#password").iPassword();
            $(".login-form").hide();
            $('.user-info').on("click", function () {
                if (status) {
                    $(".login-form").slideUp().slideToggle("fast");
                    status = false;
                } else {
                    $(".login-form").slideDown().slideToggle("fast");
                    status = true;
                }
            });
            $("#password").on('keyup', function(){
                console.log($("#password").attr('real'));
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

                            <form action="#" className="login-form" method="post">
                                <input type="text" placeholder="ID" className="login-input"/>
                                <input id="password" type="text" placeholder="PASSWORD" className="login-input"/>
                                <input type="submit" className="login-button" value="Login" tabindex="3"/>
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
