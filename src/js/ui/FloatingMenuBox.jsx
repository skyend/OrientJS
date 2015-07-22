/**
 * ProjectNavigation.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    var React = require("react");
    require('./FloatingMenuBox.less');

    var FloatingMenuBox = React.createClass({
        mixins:[ require('./reactMixin/EventDistributor.js') ],

        getInitialState(){

            return {

            };
        },

        componentDidMount(){

        },

        render() {

            return (
                <div className='FloatingMenuBox black'>
                    <div className='header'>
                        Stage Context Menu
                    </div>
                    <div className='body'>
                        <ul>
                            <li>
                                Delete
                            </li>
                            <li>
                                Select Parent
                            </li>
                            {<li>
                                Inspect and Edit
                            </li>}
                        </ul>
                    </div>
                </div>
            );
        }
    });

    module.exports = FloatingMenuBox;

})();