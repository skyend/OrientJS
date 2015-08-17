var Document = require('./Document.js');

var DocumentContextController = function(_document) {

  // 입력된 document가 있다면 그것을 사용하고
  if (typeof _document !== 'undefined') {
    this.document = _document;
  } else {
    // 없다면 새로운 Document를 생성한다.
    this.document = new Document();
  }

  console.log('document', this.document);

};


module.exports = DocumentContextController;