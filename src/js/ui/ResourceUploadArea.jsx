
var React = require("react");
require('./ResourceUploadArea.less');

var ResourceUploadArea = React.createClass({
    mixins: [require('./reactMixin/EventDistributor.js')],

    getInitialState(){
        return {
        };
    },
    handleFileSelectDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var self = this;
        var files = evt.dataTransfer.files; // FileList object
        //파일목록을 통해 루프를 돌며 썸네일 생성
        for (var i = 0, f; f = files[i]; i++) {
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    self.emit('DisplayModal', {triggerKey:'ResourceUploader', value: { fileName: theFile.name, src: e.target.result }});
                };
            })(f);
            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    },

    handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    },

    componentDidMount(){
        var ResourcedUpload = document.getElementById('information');
        ResourcedUpload.addEventListener('dragover', this.handleDragOver, false);
        ResourcedUpload.addEventListener('drop', this.handleFileSelectDrop, false);

    },
    render() {
        return (
            <div id="information" className="information">
                <div id="contentBox" className="contentBox">
                </div>
            </div>
        );
    }
});

module.exports = ResourceUploadArea;
