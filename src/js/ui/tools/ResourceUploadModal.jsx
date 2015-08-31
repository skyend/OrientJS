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
    var cookie = require('js-cookie');
    var $ = require('jquery');
    require('./ResourceUploadModal.less');
    var uploadFileList = [];
    var ResourceUploadModal = React.createClass({

        getInitialState(){
            return {
                storedToolState: null
            };
        },
        close(){
            console.log('close')
            this.setState({storedToolState: null});
        },
        componentDidUpdate(){
            if (this.state.storedToolState !== null) {
                if (this.state.storedToolState.extraParam !== null) {
                    uploadFileList = [];
                    var uploadFile = this.state.storedToolState.extraParam.uploadFile;
                    var src = this.state.storedToolState.extraParam.src;
                    var div = document.createElement('div');
                    div.innerHTML = ['<img class="thumb" src="', src, '" title="', uploadFile.name, '"/>'].join('');
                    document.getElementById('form').insertBefore(div, document.getElementById('form').childNodes[0]);
                    document.getElementById('fileName').value = uploadFile.name;
                    uploadFileList.push(src);

                }
            }
        },
        fileUpload(){
            var session_token = cookie.get('session_token');
            $.each(uploadFileList, function (index, file) {
                $.ajax({
                    url: "http://125.131.88.77:8081/restful/servicebuilder/resource/upload",
                    type: 'POST',
                    crossDomain: true,
                    headers: {session_token: session_token},
                    data: JSON.stringify({file_name: file.name, material_file: file}),
                    success: function (data, status, xhr) {
                        console.log('success');
                    },
                    error: function (data, xhr) {
                        console.log('error');
                    }
                });
            });
        },
        render() {
            return (
                <div className="ResourceUploadModal">
                    <form>
                        <div id="form" className="form-group">
                            <label forHtml="fileName">File Name</label>
                            <input type="text" className="form-control" id="fileName" placeholder="Enter file name"/>
                            <input id="upload" type="button" className="btn btn-primary" value="Upload" onClick={this.fileUpload}/>
                        </div>
                    </form>
                </div>

            );
        }
    });
    module.exports = ResourceUploadModal;
})();
