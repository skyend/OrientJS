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
        getInitialState() {
            return {
                Modal: <div/>
            }
        },
        render: function () {
            var Modal = this.state.Modal;

            return (
                <div id="ui-modal">
                    <div className="modal">
                        <div className="modalHeader">
                            <a href="#close" title="Close" className="close fa fa-times" ></a>
                        </div>
                        <div className="modalBody">
                            {Modal}
                        </div>
                    </div>
                </div>
            )
        }
    });

    module.exports = Modal;

})();


