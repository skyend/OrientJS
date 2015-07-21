/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    require('./Modal.less');

    var React = require("react");
    var Modal = React.createClass({
        getInitialState(){
            return {
                Modal: <div/>
            }
        },
        render: function () {
            var Modal = this.state.Modal;

            return (
                <div id="ui-modal">
                    {Modal}
                </div>
            )
        }
    });

    module.exports = Modal;

})();


