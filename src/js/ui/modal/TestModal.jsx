/**
 * PanelTools.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    var React = require("react");

    var TestModal = React.createClass({
        render() {
            return (
                <div className="TestModal">
                    <a href="#close" title="Close" className="close">X</a>
                    <div>모다아라라라라라아아알</div>
                </div>
            );
        }
    });

    module.exports = TestModal;

})();
