/**
 * Builder,StageContext
 * 스테이지 컨텍스트
 *
 *
 *
 * Requires(JS) :
 *
 * Events: onload
 */

(function(){
    var HistoricalDocument = require('./builder.HistoricalDocument.js');



    var StageContext = function( _params ){
        this.params = _params || {};
        {
            stageLoadedCallback : function anonymous(){}
        };

        this.iframe;
        this.innerWindow;
        this.innerDocument;
        this.historicalDocument;
    };

    StageContext.prototype.setIFrameStage = function( _iframe ){
        var self = this;
        this.iframe = _iframe;

        // iframe 로드 이벤트 등록
        this.iframe.onload = function(){ self.loadedIFrame() };
    };

    StageContext.prototype.loadedIFrame = function(){
        this.innerWindow = this.iframe.contentWindow || this.iframe.contentDocument;
        this.innerDocument = this.innerWindow.document;

        this.historicalDocument = new HistoricalDocument(this.innerWindow);


        if( typeof this.params.stageLoadedCallback === 'function' ) this.params.stageLoadedCallback();
    };

    module.exports = StageContext;
})();