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
    require('./ResourceUploadModal.less');
    var ResourceUploadModal = React.createClass({
        getInitialState(){
            return {
                storedToolState: null
            };
        },
        render() {
            if (this.state.storedToolState !== null) {
                if(this.state.storedToolState.extraParam !== null){
                    var fileName = this.state.storedToolState.extraParam.fileName;
                    var src = this.state.storedToolState.extraParam.src;
                    console.log(this.state.storedToolState.extraParam);
                    var div = document.createElement('div');
                    //this.refs['render-zone'].getDOMNode().innerHTML = ['<img class="thumb" src="', src,
                    //    '" title="', fileName, '"/>'].join('');
                    div.innerHTML = ['<img class="thumb" src="', src,
                        '" title="', fileName, '"/>'].join('');
                    document.getElementById('form').insertBefore(div, document.getElementById('form').childNodes[0]);
                }
            }
            return (
                <div className="ResourceUploadModal">
                    <form>
                        <div id="form" class="form-group">
                            <div ref='render-zone'/>
                            <label id="fileName" forHtml="fileNameInput">File Name</label>
                            <input type="text" className="form-control" id="fileNameInput" placeholder="file name"/>
                        </div>
                    </form>
                </div>

            );
        }
    });

    module.exports = ResourceUploadModal;

})();
