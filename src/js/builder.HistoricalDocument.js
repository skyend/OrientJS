/**
 * Builder,HistoricalDocument
 * 역사적 문서
 *
 * Document의 변화및 구성을 기록하여 관리한다.
 *
 */

(function () {
    var HistoricalDocument = function (_window) {
        this.window = _window;
        this.document = this.window.document;
        this.htmlElement = this.document.getElementsByTagName('html').pop()

        if (typeof this.htmlElement !== 'object' || this.htmlElement === null) throw new Error('not found HTML Element in HistoricalDocument');

    };

    /**
     * 지정된 DomElement 를 읽고 VirtualDom을 추출한다.
     */
    HistoricalDocument.prototype.readAndExportVirtualDom = function (_vdomID) {

    };

    module.exports = HistoricalDocument;

})();