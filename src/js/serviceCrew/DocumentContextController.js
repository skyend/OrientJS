var Document = require('./Document.js');

var DocumentContextController = function(_document) {

  // 입력된 document가 있다면 그것을 실제 Document Object로 변환하고
  if (typeof _document !== 'undefined') {

    this.document = new Document(_document);
  } else {

    // 없다면 새로운 Document를 생성한다.
    this.document = new Document();
  }

  console.log('document created', this.document);

};

/*********
 * Attach / Pause / Resume
 *
 */

DocumentContextController.prototype.attach = function(_directContext) {
  this.attached = true;
  this.directContext = _directContext;

  /* processing */

  this.beginRender();

};

DocumentContextController.prototype.pause = function() {
  this.running = false;

  /* processing */

};

DocumentContextController.prototype.resume = function() {
  this.running = true;

  /* processing */

};

/***************
 * beginRender
 * DirectContext 의 iframeStage에 현재 Document의 내용을 랜더링한다.
 *
 */
DocumentContextController.prototype.beginRender = function() {
  console.log(this.document.rootElementNode, 'render');

};

module.exports = DocumentContextController;