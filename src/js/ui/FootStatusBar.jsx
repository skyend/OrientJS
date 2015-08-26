/**
 * Created by hanjinwoong on 15. 7. 2..
 */

/**
 * Footer.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    require('./FootStatusBar.less');
    var React = require("react");

    var VNodePathNavigator = require('./partComponents/VNodePathNavigator.jsx');

    var FootStatusBar = React.createClass({
        getInitialState(){
            return {
              vnodePathArray:[]
            }
        },
        render: function () {
            return (
                <footer id="ui-footer">
                    <ul className="inventory">
                        <li className="item-left">
                            <a>
                                <i className="fa fa-info-circle"></i>
                            </a>
                        </li>
                        
                        <li className="item-right">
                            <VNodePathNavigator vnodePathArray={this.state.vnodePathArray} height="100%" />
                        </li>
                    </ul>
                </footer>
            )
        }
    });


    module.exports = FootStatusBar;

})();
