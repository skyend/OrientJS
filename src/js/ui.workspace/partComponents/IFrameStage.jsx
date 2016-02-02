/**
 * IFrameStage (react)
 * IFrame을 조작하고 내부 인터페이스를 구현함
 *
 * Requires: IFrameStage.less
 */

var React = require("react");
require('./IFrameStage.less');

var IFrameStage = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getDefaultProps() {
    return {
      src: "about:blank",
      allowScripts: true,
      allowForms: true
    };
  },


  getInitialState() {
    return {
      src: undefined
    };
  },

  getIframeInnerWindow() {
    var iframeDom = this.refs['iframe'].getDOMNode();

    return iframeDom.contentWindow || iframeDom;
  },

  getIFrameInnerDoc() {
    var innerWindow = this.getIframeInnerWindow();
    return innerWindow.contentDocument || innerWindow.document;
  },

  getInnerBody() {
    return this.getIFrameInnerDoc().querySelector('body');
  },

  getInnerHead() {
    return this.getIFrameInnerDoc().querySelector('head');
  },

  getScrollX() {
    return this.getIFrameInnerDoc().body.scrollLeft;
  },

  getScrollY() {
    return this.getIFrameInnerDoc().body.scrollTop;
  },

  writeContentsToBody(_html, _styles) {
    this.getInnerBody().innerHTML = _html;
    this.getInnerHead().innerHTML = '<style>' + _styles + '</style>';
  },

  addStyle(_key, _style) {
    if (typeof this.styles === 'undefined')
      this.styles = {};

    this.styles[_key] = _style;
    var styleLines = '';
    var styleKeys = Object.keys(this.styles);

    for (var i = 0; i < styleKeys.length; i++) {
      styleLines += this.styles[styleKeys[i]];
    }


    let styleBlock = this.getIFrameInnerDoc().getElementById('#style_'+_key);

    if ( styleBlock === null) {
      styleBlock = this.getIFrameInnerDoc().createElement('style');
      styleBlock.type = 'text/css';
      styleBlock.id = 'style_'+_key;
      this.getInnerHead().appendChild(styleBlock);
    }

    styleBlock.innerHTML = styleLines;
  },


  removeStyle(_key) {
    if (typeof this.styles !== 'object')
      throw new Error("Styles collection is not declared.");
    if (typeof this.styles[_key] !== 'string')
      throw new Error("Style[" + _key + "] is not exists.");

    delete this.styles[_key];
  },

  getElementByVid(_vid){
    return this.getIFrameInnerDoc().querySelector('[__vid__="' + _vid + '"]');
  },

  appendStyleElement(_element){
    this.getIFrameInnerDoc().head.appendChild(_element);
  },

  appendScriptElementToHead(_element){
    this.getIFrameInnerDoc().head.appendChild(_element);
  },

  appendScriptElementToBodyTail(_element){
    try{

      console.log(this.getIFrameInnerDoc(), _element);
      this.getIFrameInnerDoc().body.appendChild(_element);
    }catch(_e){

    }
  },

  appendScriptElementToHTML(_element){
    this.getIFrameInnerDoc().head.parentElement.appendChild(_element);
  },

  insertElementToInLastBySelector(_selector, _element){
    var baseTarget = this.getIFrameInnerDoc().querySelector(_selector);

    return baseTarget.appendChild(_element);
  },

  insertElementToInLastByVid(_baseTargetVid, _element) {

    return this.insertElementToInLastBySelector('[__vid__="' + _baseTargetVid + '"]', _element);
  },

  insertElementToBeforeBySelector(_selector, _element) {
    var baseTarget = this.getIFrameInnerDoc().querySelector(_selector);

    var parentElement = baseTarget.parentElement;

    if (parentElement === null) {
      this.emit('NoticeMessage', {
        title: "컴포넌트 삽입 실패",
        message: "해당영역에 삽입할 수 없습니다.",
        level: "error"
      });
      return;
    }

    return parentElement.insertBefore(_element, baseTarget);
  },

  insertElementToBeforeByVid(_baseTargetVid, _element) {
    return this.insertElementToBeforeBySelector('[__vid__="' + _baseTargetVid + '"]', _element);
  },

  insertElementToAfterBySelector(_selector, _element) {
    var baseTarget = this.getIFrameInnerDoc().querySelector(_selector);
    var parentElement = baseTarget.parentElement;

    if (parentElement === null) {
      this.emit('NoticeMessage', {
        title: "컴포넌트 삽입 실패",
        message: "해당영역에 삽입할 수 없습니다.",
        level: "error"
      });
      return;
    }

    // 기준이 되는 요소의 다음요소가 없을 경우 appendChild로 삽입한다.
    if (baseTarget.nextElementSibling === null) {
      return parentElement.appendChild(_element);
    } else {
      // 다음요소가 있으면 다음요소의 이전에 요소를 삽입한다.
      return parentElement.insertBefore(_element, baseTarget.nextElementSibling);
    }
  },

  insertElementToAfterByVid(_baseTargetVid, _element) {
    return this.insertElementToAfterBySelector('[__vid__="' + _baseTargetVid + '"]', _element);
  },

  onIframeLoaded(_e) {
    let iframe = _e.target;
    console.log(_e, _e.nativeEvent);
    var self = this;
// 임시 차후에 EditorStageContext 에서 처리되어야 함
    var iwindow = iframe.contentWindow || iframe.contentDocument;
    var innerDocument = iwindow.document;
    this.currentIframeDocument = innerDocument;

    this.bindContextMenuTrigger(iframe);
    console.log('iframe loaded');

    innerDocument.addEventListener('click', function (_ev) {
      console.log('click element');
      self.onMouseClickAtStage(_ev);
    }, false);

    innerDocument.addEventListener('dblclick', function (_ev) {
      self.onMouseDoubleClickAtStage(_ev);
    }, false);

    innerDocument.addEventListener('mousedown', function (_ev) {
      self.onMouseDownAtStage(_ev);
    }, false);

    innerDocument.addEventListener('mouseover', function (_ev) {
      self.onMouseOverAtStage(_ev);
    }, false);

    innerDocument.addEventListener('scroll', function (_ev) {
      self.onScrollAtStage(_ev);
    }, false);

    innerDocument.addEventListener('drop', function (_ev) {
      console.log(_ev, 'drop in iframeStage');
    }, false);

    // iwindow.onbeforeunload = function(){
    //     return false; // This will stop the redirecting.
    // }

    if( typeof this.props.onLoadIFrame === 'function' ){
      this.props.onLoadIFrame(iframe);
    }
  },

  reload(){
    this.getIframeInnerWindow().location.reload();
  },

  /**
   * onMouseClickAtStage
   *
   */
  onMouseClickAtStage(_e) {
    this.elementClick(_e.target, _e);
  },

  onMouseOverAtStage(_e){
    this.elementHover(_e.target, _e);
  },

  onMouseDoubleClickAtStage(_e){
    this.elementDClick(_e.target, _e);
  },

  onScrollAtStage(_e){

    this.emit("ScrollAtStage", {}, _e, "Scroll");
  },


  elementClick(_target, _e){
    let element = this.searchPointedDOM(_target, _e.x, _e.y);
    console.log(element);

    this.emit("ClickElementInStage", {
      targetDOMNode: element
    });
  },

  elementHover(_target, _e){
    let element = this.searchPointedDOM(_target, _e.x, _e.y);

    if( element.nodeName === '#text' ){
      element = element.parentNode;
    }

    this.emit("HoverElementInStage", {
      targetDOMNode: element
    });
  },

  elementDClick(_target, _e){
    this.emit("DClickElementInStage", {
      targetDOMNode: this.searchPointedDOM(_target, _e.x, _e.y)
    });
  },

  searchPointedDOM(_target, _mx, _my){
    var targetNode = _target;
    var childNodes = targetNode.childNodes;

    if (childNodes.length > 0) {
      var childNode;
      var range;
      var rects;
      var found = false;
      for (var i = 0; i < childNodes.length; i++) {
        childNode = childNodes[i];

        range = document.createRange();
        range.selectNodeContents(childNode);
        rects = range.getClientRects();

        if (rects.length == 0) break;
        for (var j = 0; j < rects.length; j++) {
          //console.log( childNode, range, rects);
          if (( rects[j].left < _mx && rects[j].right > _mx ) &&
            ( rects[j].top < _my && rects[j].bottom > _my )) {
            targetNode = childNode;

            found = true;
          }
        }

        if (found) {
          break;
        }
      }
    }

    return targetNode;
  },

  /**
   * onMouseDownAtStage
   *
   */
    onMouseDownAtStage(_e) {
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
    if( this.props.freeContextMenu ){
      return;
    }

    _e.preventDefault();
    var selfDom = this.getDOMNode();
    //console.log("call contextmenu", _e);
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
        //stageContextId: "", // 현재 편집중인 ContextID
        //elementId: "", // 컨텍스트 메뉴가 바라보는 ElementID / ID는 Dom 의 Attribute 중의 id 가 아니라 빌더에서만 사용되는 DOM요소의 특별한 ID이다. 예) --eid
        element: targetElement
      }
    }, _e, "MouseEvent");

    return false;
  },

  componentDidUpdate() {
    var self = this;
    var iframe = this.refs['iframe'].getDOMNode();

    // iframe.onload = function (_e) {
    //   self.onIframeLoaded(iframe);
    // };

  },

  componentDidMount() {
    var iframe = this.refs['iframe'].getDOMNode();
    //this.onIframeLoaded(iframe);

    if (this.state.src === undefined) {
      this.setState({
        src: this.props.src
      });
    }
  },

  render() {
    var classes = [];
    classes.push('IFrameStage');
    classes.push('theme-default');
    classes.push(this.props.color);
    classes.push(this.props.size);


    let sandBoxOptions = ['allow-same-origin','allow-pointer-lock','allow-popups'];
    if( this.props.allowScripts ){
      sandBoxOptions.push('allow-scripts');
    }

    if( this.props.allowForms ){
      sandBoxOptions.push('allow-forms');
    }

    return (
      <div className={classes.join(' ')}
           style={{
        width: this.props.width,
        height: this.props.height,
        left: this.props.left || 'auto',
        top: this.props.top || 'auto'
      }}>

        <iframe seamless sandbox={sandBoxOptions.join(' ')} ref='iframe' onLoad={this.onIframeLoaded} src={this.state.src}/>
      </div>
    );
  }
});

module.exports = IFrameStage;
