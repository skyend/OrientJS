var React = require("react");
require('./ResourceUploadArea.less');

var ResourceUploadArea = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  getInitialState () {
    return {};
  },
  handleFileSelectDrop (evt) {
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
      reader.onload = (function(uploadFile) {
        return function(e) {
          // Render thumbnail.
          console.log(uploadFile);
          self.emit('DisplayModal', {
            triggerKey: 'ResourceUploader',
            value: {
              uploadFile: uploadFile,
              src: e.target.result
            }
          });
        };
      })
      (f);
      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  },

  handleDragOver (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  },

  componentDidMount () {
    var ResourcedUpload = document.getElementById('ResourceUploadArea');
    ResourcedUpload.addEventListener('dragover', this.handleDragOver, false);
    ResourcedUpload.addEventListener('drop', this.handleFileSelectDrop, false);

  },
  render () {
    return (
      <div id="ResourceUploadArea" className="ResourceUploadArea">
        <div id="contentBox" className="contentBox"></div>
      </div>
    );
  }
});

module.exports = ResourceUploadArea;
