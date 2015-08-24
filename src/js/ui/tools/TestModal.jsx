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
      getInitialState(){
        return {
          storedToolState:null
        };
      },
      
      render() {
        if( this.state.storedToolState !== null ){
          console.log( this.state.storedToolState.extraParam);
        }


          return (
              <div className="testModal">
                  <div>모다아라라라라라아아알</div>
              </div>
          );
      }
    });

    module.exports = TestModal;

})();
