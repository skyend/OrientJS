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

        clickSave(){
          this.emit('SaveCurrentContext');
        },

        modeChangeTablet(){
          this.emit('ChangeStageMode', {
            mode:'tablet'
          });
        },

        modeChangeMobile(){
          this.emit('ChangeStageMode', {
            mode:'mobile'
          });
        },

        modeChangeDesktop(){
          this.emit('ChangeStageMode', {
            mode:'desktop'
          });
        },

        componentDidMount: function () {
            this.setUserInfo();
        },
        render: function () {
            return (
                <header id="ui-header">
                    <ul className="navigation">
                      <li>
                          <button onClick={this.modeChangeTablet}>
                              <i className="fa fa-tablet"></i>
                          </button>
                      </li>
                      <li>
                          <button onClick={this.modeChangeMobile}>
                              <i className="fa fa-mobile"></i>
                          </button>
                      </li>
                      <li>
                          <button onClick={this.modeChangeDesktop}>
                              <i className="fa fa-desktop"></i>
                          </button>
                      </li>
                        <li>
                            <button onClick={this.clickSave}>
                                <i className="fa fa-floppy-o"></i>
                            </button>
                        </li>

                        <li>
                            <button className="user-info">
                                <i className="fa fa-user"></i>
                            </button>
                        </li>
                    </ul>
                </header>
            )
        }
    });
    module.exports = HeadToolBar;

})();
