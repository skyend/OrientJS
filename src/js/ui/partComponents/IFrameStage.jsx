/**
 * IFrameStage (react)
 * IFrame을 조작하고 내부 인터페이스를 구현함
 *
 * Requires: IFrameStage.less
 */

var React = require("react");
require('./IFrameStage.less');

var IFrameStage = React.createClass({
    mixins:[require('../reactMixin/EventDistributor.js')],

    getInitialState(){
        return {
          src:"about:blank"
        };
    },

    getIframeInnerWindow(){
        var iframeDom = this.refs['iframe'].getDOMNode();

        return iframeDom.contentWindow || iframeDom;
    },

    getIFrameInnerDoc(){
        var innerWindow = this.getIframeInnerWindow();
        return innerWindow.contentDocument || innerWindow.document;
    },

    getInnerBody(){
        return this.getIFrameInnerDoc().querySelector('body');
    },

    getInnerHead(){
        return this.getIFrameInnerDoc().querySelector('head');
    },

    getScrollX(){
        return this.getIFrameInnerDoc().body.scrollLeft;
    },

    getScrollY(){
        return this.getIFrameInnerDoc().body.scrollTop;
    },

    writeContentsToBody( _html, _styles ){
        this.getInnerBody().innerHTML = _html;
        this.getInnerHead().innerHTML = '<style>'+ _styles +'</style>';
    },

    addStyle( _key, _style ){
      if( typeof this.styles === 'undefined' ) this.styles = {};

      this.styles[_key] = _style;
      var styleLines = '';
      var styleKeys = Object.keys(this.styles);

      for(var i = 0; i < styleKeys.length; i++ ){
        styleLines += this.styles[ styleKeys[i] ];
      }



      if( typeof this.componentStyleElement === 'undefined' ){
        var styleTag = this.getIFrameInnerDoc().createElement('style');
        styleTag.type = 'text/css';
        this.getInnerHead().appendChild(styleTag);

        this.componentStyleElement = styleTag;
      }

      this.componentStyleElement.innerHTML = styleLines;
    },

    removeStyle(_key){
      if( typeof this.styles !== 'object') throw new Error("Styles collection is not declared.");
      if( typeof this.styles[_key] !== 'string' ) throw new Error("Style["+_key+"] is not exists.");

      delete this.styles[_key];
    },

    insertElementToInLast( _baseTargetVid, _element ){
      var baseTarget = this.getIFrameInnerDoc().querySelector('[__vid__="'+_baseTargetVid+'"]');

      baseTarget.appendChild( _element);
    },


    insertElementToBefore( _baseTargetVid, _element ){
      var baseTarget = this.getIFrameInnerDoc().querySelector('[__vid__="'+_baseTargetVid+'"]');

      var parentElement = baseTarget.parentElement;

      if( parentElement === null ){
        this.emit('NoticeMessage', {
          title:"컴포넌트 삽입 실패",
          message:"해당영역에 삽입할 수 없습니다.",
          level:"error"
        });
        return;
      }

      parentElement.insertBefore(_element, baseTarget);
    },

    insertElementToAfter( _baseTargetVid, _element ){
      var baseTarget = this.getIFrameInnerDoc().querySelector('[__vid__="'+_baseTargetVid+'"]');
      var parentElement = baseTarget.parentElement;

      if( parentElement === null ){
        this.emit('NoticeMessage', {
          title:"컴포넌트 삽입 실패",
          message:"해당영역에 삽입할 수 없습니다.",
          level:"error"
        });
        return;
      }

      // 기준이 되는 요소의 다음요소가 없을 경우 appendChild로 삽입한다.
      if( baseTarget.nextElementSibling === null ){
        parentElement.appendChild( _element );
      } else {
        // 다음요소가 있으면 다음요소의 이전에 요소를 삽입한다.
        parentElement.insertBefore( _element, baseTarget.nextElementSibling);
      }
    },

    onIframeLoaded(_iframe) {
        var self = this;
// 임시 차후에 EditorStageContext 에서 처리되어야 함
        var iwindow = _iframe.contentWindow || _iframe.contentDocument;
        var innerDocument = iwindow.document;
        this.currentIframeDocument = innerDocument;

        this.bindContextMenuTrigger(_iframe);

        innerDocument.addEventListener('click', function (_ev) {
            self.onMouseClickAtStage(_ev);
        }, false);
    },

    /**
     * onMouseClickAtStage
     *
     */
    onMouseClickAtStage(_e) {
        this.emit("ClickElementInStage", {
            clickedTarget: null
        }, _e, "MouseClick");
    },

    /**
     * bindContextMenuTrigger
     *
     * Stage의 IFrame 내부를 클릭 했을 때 기존의 ContextMenu호출을 블럭하고 Builder자체의 Stage용 ContextMenu를 호출 하도록 이벤트를 입력한다.
     *
     * @param _iframe
     */
    bindContextMenuTrigger(_iframe) {
        var self = this;

        var iwindow = _iframe.contentWindow || _iframe.contentDocument;
        var innerDocument = iwindow.document;

        innerDocument.addEventListener('contextmenu', function (_e) {
            return self.onCallContextMenu(_e);
        }, false);
    },

    onCallContextMenu(_e) {

        _e.preventDefault();
        var selfDom = this.getDOMNode();
        console.log("call contextmenu", _e);
        var x,
            y;

        // client Rect of iframe
        var clientRect = selfDom.getBoundingClientRect();

        x = _e.clientX + clientRect.left;
        y = _e.clientY + clientRect.top;
        //console.log(_e.clientX, _e.clientY, editorStageWrapperY, editorStageWrapperX);
        var targetElement = _e.toElement;

        this.emit("CallContextMenu", {
            mouseX: x,
            mouseY: y,

            // for 필드는 이 컨텍스트 메뉴가 무엇을 위한 컨텍스트 메뉴인지 의미한다.
            for: "StageElement", // 에디팅중인 도큐먼트의 Stage의 Element
            target: {
                stageContextId: "", // 현재 편집중인 ContextID
                elementId: "", // 컨텍스트 메뉴가 바라보는 ElementID / ID는 Dom 의 Attribute 중의 id 가 아니라 빌더에서만 사용되는 DOM요소의 특별한 ID이다. 예) --eid
                element: targetElement
            }
        }, _e, "MouseEvent");

        return false;
    },

    componentDidUpdate(){
      var self = this;
      var iframe = this.refs['iframe'].getDOMNode();

      iframe.onload = function (_e) {
          self.onIframeLoaded(iframe);
      };

    },

    componentDidMount(){
      var iframe = this.refs['iframe'].getDOMNode();
      this.onIframeLoaded(iframe);
    },

    render() {
        var classes = [];
        classes.push('IFrameStage');
        classes.push('theme-default');
        classes.push( this.props.color );
        classes.push( this.props.size );

        return (
            <div className={ classes.join(' ') } style={ { width: this.props.width, height: this.props.height } } >
                <iframe ref='iframe' src={this.state.src} />
            </div>
        );
    }
});

module.exports = IFrameStage;
