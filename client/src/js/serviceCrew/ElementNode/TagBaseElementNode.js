 import ElementNode from './ElementNode.js';
 import ObjectExtends from '../../util/ObjectExtends';
 import MetaText from '../Data/MetaText';
 import ArrayHandler from '../../util/ArrayHandler';

 "use strict";

 const PIPE_EVENT_SPLIT_REGEXP = /^en-pipe-event-([\w\-\_\d]+)$/;

 const DOM_EVENTS = [
   // Mouse Events
   'click',
   'contextmenu',
   'dblclick',
   'mousedown',
   'mouseenter',
   'mouseleave',
   'mousemove',
   'mouseover',
   'mouseout',
   'mouseup',

   // Keyboard Events
   'keydown',
   'keypress',
   'keyup',

   // Frame/Object Events
   'abort',
   'beforeunload',
   'error',
   'hashchange',
   'load',
   'pageshow',
   'pagehide',
   'resize',
   'scroll',
   'unload',

   // Form Events
   'blur',
   'change',
   'focus',
   'focusin',
   'focusout',
   'input',
   'invalid',
   'reset',
   'search',
   'select',
   'submit',

   // Drag Events
   'drag',
   'dragend',
   'dragenter',
   'dragleave',
   'dragover',
   'dragstart',
   'drop',

   // Clipboard Events
   'copy',
   'cut',
   'paste',

   // Print Events
   'afterprint',
   'beforeprint',

   // Media Events
   'abort',
   'canplay',
   'canplaythrough',
   'durationchange',
   'emptied',
   'ended',
   'error',
   'loadeddata',
   'loadedmetadata',
   'loadstart',
   'pause',
   'play',
   'playing',
   'progress',
   'ratechange',
   'seeked',
   'seeking',
   'stalled',
   'suspend',
   'timeupdate',
   'volumechange',
   'waiting',

   // Animation Events
   'animationend',
   'animationiteration',
   'animationstart',

   // Transition Events
   'transitionend',

   // Server-Sent Events
   'error',
   'message',
   'open',

   // Misc Events
   'message',
   'mousewheel',
   'online',
   'offline',
   'popstate',
   'show',
   'storage',
   'toggle',
   'wheel',

   // Touch Events
   'touchcancel',
   'touchend',
   'touchmove',
   'touchstart'
 ];

 var SUPPORT_HTML_TAG_STYLES = {};
 try {
   if (window) {
     SUPPORT_HTML_TAG_STYLES = ObjectExtends.clone(window.document.head.style);
   }
 } catch (_e) {
   console.warn('Window is not declared');
 }


 class TagBaseElementNode extends ElementNode {
   constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
     super(_environment, _elementNodeDataObject, _preInjectProps, _isMaster);
     this.tagName;
     this.attributes;
     this.css;
     this.rectangle; // 영역 정보 { width: (px|%|remain|auto), height:(px|%|remain|auto), shift-(left|right|top|bottom): (px|%),} // shift : 지정 값만큼 해당방향으로 밀어준다
     // remain : 부모의 영역중 자신외의 다른 child가 차지하는 공간을 모두 합하여 부모의 영역에서 그만큼 감소 시켰을 때 남은 값
     this.phase; // 위상 자신의 위치정보를 가진다. { horizon: (px|%|left|center|top), vertical: (px|%|top|middle|bottom) }

     if (typeof _elementNodeDataObject !== 'object') {
       // 새 엘리먼트가 생성되었다.
       this.attributes = [];
       this.children = [];
     }
   }


   get behavior() {
     return this._behavior;
   }

   // Getters
   // element.tagName -> getTagName()
   getTagName() {
     return this.tagName || 'div';
   }

   hasAttribute(_name) {
     return this.findAttributeIndex(_name) !== -1;
   }

   findAttributeIndex(_name) {
     return ArrayHandler.findIndex(this.attributes, function(_v) {
       return _v.name === _name;
     });
   }

   // attribute
   getAttribute(_name) {
     let foundIndex = this.findAttributeIndex(_name);

     if (foundIndex !== -1) {
       return this.attributes[foundIndex].variable;
     }

     console.error(`Attribute '${_name}' 가 정의되지 않았습니다.`);
   }


   getAttributeWithResolve(_attrName) {
     return this.interpret(this.getAttribute(_attrName));
   }

   // id
   getIdAtrribute() {
     return this.getAttribute('id');
   }

   // classes
   getClasses() {
     return this.getAttribute('class');
   }

   // attributes
   getAttributes() {
     return this.attributes;
   }

   // Inline Style
   getInlineStyle() {
     return this.getAttribute('style');
   }

   getRectangle() {
     return this.rectangle;
   }

   getBoundingRect() {

     var boundingRect;
     var realElement = this.getRealization();

     boundingRect = realElement.getBoundingClientRect();

     return boundingRect;
   }

   getCurrentRectangle() {
     //    console.log(this);
     //switch (this.environment.contextController.getScreenSizing()) {
     // switch (this.environment.getScreenSizing()) {
     //   case "desktop":
     //     return this.rectangle['desktop'];
     //   case "tablet":
     //     return this.rectangle['tablet'];
     //   case "mobile":
     //     return this.rectangle['mobile'];
     // }
     return {};
   }

   getRectangleByScreenMode(_screenMode) {
     return this.rectangle[_screenMode];
   }

   get zIndex() {
     return this._zIndex;
   }



   set behavior(_behavior) {
     this._behavior = _behavior;
   }


   // Setters
   // Id Atrribute
   setIdAtrribute(_id) {
     this.setAttribute('id', _id);
   }

   // tagName
   setTagName(_tagName) {
     this.tagName = _tagName;
   }

   // classes
   setClasses(_classes) {
     this.setAttribute('class', _classes);
   }

   // css
   setCSS(_css) {
     this.css = _css;
   }

   // Inline Style
   setInlineStyle(_style) {
     this.setAttribute('style', _style);
   }

   setRectangle(_rectangle) {
     this.rectangle = _rectangle;
   }

   // attribute
   setAttribute(_name, _value) {
     let that = this;

     let foundIndex = this.findAttributeIndex(_name);

     if (foundIndex !== -1) {
       this.attributes[foundIndex].variable = _value;
     } else {
       console.warn(`'${_name}' attribute 가 정의되지 않았습니다. 정의되지 않은 Attribute의 값을 변경할 수 없습니다.`);
     }
   }

   setInitialAttribute(_name, _initValue) {
     let foundIndex = this.findAttributeIndex(_name);

     if (foundIndex !== -1) {
       this.attributes[foundIndex].seed = _initValue;
     } else {
       console.warn(`'${_name}' attribute 가 정의되지 않았습니다. 새 Attribute를 생성합니다.`);
       this.defineNewAttribute(_name, _initValue);
     }
   }

   defineNewAttribute(_name, _initialValue) {
     let that = this;

     let duplIndex = this.findAttributeIndex(_name);

     if (duplIndex === -1) {
       let newAttribute = new MetaText({
         name: _name,
         seed: _initialValue
       });

       this.attributes.push(newAttribute);
     } else {
       console.warn(`이미 있는 Attribute'${_name}'를 정의하려 합니다. 이 작업은 무시됩니다.`);
     }
   }

   // setAttributeWithEvent(_name, _value){
   //   this.setAttribute(_name, _value)
   // }

   setRectanglePartWithScreenMode(_partName, _partValue, _screenMode) {
     var rectangleRef = this.getRectangleByScreenMode(_screenMode);
     console.log(arguments);
     // 단순화
     rectangleRef[_partName] = _partValue;

     // 밑의 구문이 원래 구문이었음 후에 Rectangle관련 문제시 참조하기
     // if (/^[\d\.]+$/.test(rectangleRef[_partName])) {
     //   // 숫자로만 이루어져 있을 경우
     //   rectangleRef[_partName] = _partValue;
     // } else if (/^[\d\.]+((\w+)|%)$/.test(rectangleRef[_partName])) {
     //   // 숫자와 알파벳 또는 퍼센트로 이루어져 있을 경우
     //   this.setRectanglePartWithKeepingUnit(_partValue, _partName);
     // } else {
     //   // 아무것도 해당되지 않을 경우
     //   rectangleRef[_partName] = _partValue;
     // }
   }

   setRectanglePartWithKeepingUnit(_partValue, _partName) {
     //console.log(valueWithUnitSeperator(_partValue));
   }

   set zIndex(_zIndex) {
     this._zIndex = _zIndex;
   }


   mappingAttributes(_domNode, _options) {
     for (let i = 0; i < this.attributes.length; i++) {
       this.mappingAttribute(_domNode, this.attributes[i], _options);
     }

     var currentRect = this.getCurrentRectangle();
     let rectKeys = Object.keys(currentRect);
     let rectKey;
     for (let i = 0; i < rectKeys.length; i++) {
       rectKey = rectKeys[i];
       if (/^\d+/.test(currentRect[rectKey])) {
         _domNode.style[rectKey] = currentRect[rectKey];
       }
     }

     // #Normals
     _domNode.setAttribute('en-id', this.getId());
     _domNode.setAttribute('en-type', this.getType());
     if (this.getName())
       _domNode.setAttribute('en-name', this.getName());
     if (this.behavior)
       _domNode.setAttribute('en-behavior', this.behavior);

     // #Controls
     if (this.getControl('repeat-n'))
       _domNode.setAttribute('en-ctrl-repeat-n', this.getControl('repeat-n'));
     if (this.getControl('hidden'))
       _domNode.setAttribute('en-ctrl-hidden', this.getControl('hidden'));

     // #DynamicContext
     if (this.dynamicContextSID)
       _domNode.setAttribute('en-dc-source-id', this.dynamicContextSID);
     if (this.dynamicContextPassive !== undefined)
       _domNode.setAttribute('en-dc-passive', String(this.dynamicContextPassive));
     if (this.dynamicContextRID)
       _domNode.setAttribute('en-dc-request-id', this.dynamicContextRID);
     if (this.dynamicContextNS)
       _domNode.setAttribute('en-dc-ns', this.dynamicContextNS);
     if (this.dynamicContextInjectParams)
       _domNode.setAttribute('en-dc-inject-params', this.dynamicContextInjectParams);

     // #Events
     // dom defaults events
     if (this.getEvent('click'))
       _domNode.setAttribute('en-event-click', this.getEvent('click'));

     if (this.getEvent('mouseenter'))
       _domNode.setAttribute('en-event-mouseenter', this.getEvent('mouseenter'));

     if (this.getEvent('complete-bind'))
       _domNode.setAttribute('en-event-complete-bind', this.getEvent('complete-bind'));
   }

   mappingAttribute(_dom, _attribute, _options) {
     let options = _options || {};
     let value = options.resolve ? this.interpret(_attribute.byString) : _attribute.byString;
     let name = _attribute.name;

     // value 의 최종 값이 null 이라면 Attribute가 아얘 추가되지 않도록 함수를 종료한다.
     if (value === null) return;

     switch (name) {
       case 'style':
         if (typeof value === 'object' && value !== undefined) {
           ObjectExtends.mergeByRef(_dom.style, value, true);
           return;
         }
         break;
       case 'value':
         _dom.value = value;
         break;
     }

     this.mappingAttributeDirect(_dom, name, value);
   }

   mappingAttributeDirect(_dom, _name, _value) {
     _dom.setAttribute(_name, _value);
   }


   /*
     CreateNode
       HTMLNode를 생성한다.
   */
   createNode() {

     let htmlDoc;

     if (this.environment) {
       htmlDoc = this.environment.document;
     } else {
       htmlDoc = document;
     }

     return htmlDoc.createElement(this.getTagName() || 'div');
   }


   applyForward() {
     let oldAttributes = this.forwardDOM.attributes;
     let newAttributes = this.backupDOM.attributes;
     let attrName;
     let attrValue;

     // 사라질 예정의 attribute제거
     for (let i = 0; i < oldAttributes.length; i++) {
       attrName = oldAttributes[i].nodeName;
       attrValue = oldAttributes[i].nodeValue;

       // backupDOM 에 attribute가 없으면 forwardDOM의 attribute를 제거한다.
       if (!this.backupDOM.hasAttribute(attrName)) {
         this.forwardDOM.removeAttribute(attrName);

         if (attrName === 'value')
           this.forwardDOM.value = null;

         if (attrName === 'checked')
           this.forwardDOM.checked = null;
       }
     }

     // 변경된 attribute반영
     for (let i = 0; i < newAttributes.length; i++) {
       attrName = newAttributes[i].nodeName;
       attrValue = newAttributes[i].nodeValue;

       if (attrName === 'value' && this.forwardDOM.value !== attrValue) {
         this.forwardDOM.value = attrValue;
       }

       if (attrName === 'checked' && this.forwardDOM.checked !== attrValue)
         this.forwardDOM.checked = attrValue;

       if (this.forwardDOM.getAttribute(attrName) !== attrValue) {
         this.forwardDOM.setAttribute(attrName, attrValue);
       }
     }

     //this.backupDOM = null;
   }

   ///////////
   // Remove Attribute
   removeAttribute(_attrName) {
     let that = this;
     let newAttributes = [];
     let deleted = false;

     this.attributes = this.attributes.filter(function(_attribute) {

       if (_attribute.name !== _attrName) {
         return true;
       } else {
         deleted = true;
         return false;
       }
     });

     if (!deleted) {
       console.error(`정의되지 않은 Attribute ${_attrName} 를 제거하려 합니다.`);
     }
   }


   //////////
   // Remove Attribute
   renameAttribute(_prevName, _nextName) {
     let foundIndex = this.findAttributeIndex(_prevName);

     if (foundIndex !== -1) {
       this.attributes[foundIndex].name = _nextName;
     } else {
       console.error(`정의되지 않은 Attribute ${_prevName} 의 이름을 변경하려 합니다.`);
     }
   }

   buildByElement(_domElement, _absorbOriginDOM) {

     // for Debug
     this.sourceElement = _domElement;


     this.copyAllAtrributeFromDOMElement(_domElement);

     if (this.realization === null) this.realization = _domElement;

     // Normals
     if (_domElement.getAttribute('en-id') !== null) {
       if (/@/.test(_domElement.getAttribute('en-id'))) {
         throw new Error("ElementNode Id로 @가 사용 될 수 없습니다.");
       }

       this.setId(_domElement.getAttribute('en-id'));
     }

     if (_domElement.getAttribute('en-type') !== null)
       this.setType(_domElement.getAttribute('en-type'));

     if (_domElement.getAttribute('en-behavior') !== null)
       this.behavior = _domElement.getAttribute('en-behavior');

     if (_domElement.getAttribute('en-name') !== null)
       this.setName(_domElement.getAttribute('en-name'));

     // DynamicContext
     if (_domElement.getAttribute('en-dc-source-id') !== null) {
       this.dynamicContextSID = _domElement.getAttribute('en-dc-source-id');

       if (_domElement.getAttribute('en-dc-request-id') !== null)
         this.dynamicContextRID = _domElement.getAttribute('en-dc-request-id');

       if (_domElement.getAttribute('en-dc-inject-params') !== null)
         this.dynamicContextInjectParams = _domElement.getAttribute('en-dc-inject-params');

       if (_domElement.getAttribute('en-dc-ns') !== null)
         this.dynamicContextNS = _domElement.getAttribute('en-dc-ns');


       if (_domElement.getAttribute('en-dc-passive') !== null) {
         if (_domElement.getAttribute('en-dc-passive') === 'false') {
           this.dynamicContextPassive = false;
         } else {
           this.dynamicContextPassive = true;
         }
       } else {
         this.dynamicContextPassive = false;
       }

       if (_domElement.getAttribute('en-dc-attitude') !== null) {
         throw new Error("en-dc-attitude='passive' 를 지정하셨습니다. en-dc-passive Attribute로 변경 해 주세요. 사라지게될 attribute입니다.");
       }
     }

     // Controls
     if (_domElement.getAttribute('en-ctrl-repeat-n') !== null) {
       if (this.isMaster) throw new Error("Master ElementNode 는 Repeat Control을 바인드 할 수 없습니다.");

       this.setControl('repeat-n', _domElement.getAttribute('en-ctrl-repeat-n'));
     }

     if (_domElement.getAttribute('en-ctrl-hidden') !== null)
       this.setControl('hidden', _domElement.getAttribute('en-ctrl-hidden'));

     // Event reads
     // 모든 DOM 이벤트를 인식한다.
     for (let i = 0; i < DOM_EVENTS.length; i++) {
       if (_domElement.getAttribute(`en-event-${DOM_EVENTS[i]}`) !== null) // Click
         this.setEvent(DOM_EVENTS[i], _domElement.getAttribute(`en-event-${DOM_EVENTS[i]}`));
     }

     // Gelato Events
     // done
     if (_domElement.getAttribute('en-event-will-update') !== null) // will Update
       this.setEvent('will-update', _domElement.getAttribute('en-event-will-update'));
     // done
     if (_domElement.getAttribute('en-event-did-update') !== null) // did Update
       this.setEvent('did-update', _domElement.getAttribute('en-event-did-update'));
     // done
     if (_domElement.getAttribute('en-event-will-refresh') !== null) // will refresh
       this.setEvent('will-refresh', _domElement.getAttribute('en-event-will-refresh'));
     // done
     if (_domElement.getAttribute('en-event-did-refresh') !== null) // did refresh
       this.setEvent('did-refresh', _domElement.getAttribute('en-event-did-refresh'));

     //done
     if (_domElement.getAttribute('en-event-will-dc-request') !== null) // will DC request
       this.setEvent('will-dc-request', _domElement.getAttribute('en-event-will-dc-request'));

     // done
     if (_domElement.getAttribute('en-event-will-dc-bind') !== null) // Complete Bind
       this.setEvent('will-dc-bind', _domElement.getAttribute('en-event-will-dc-bind'));

     // done
     if (_domElement.getAttribute('en-event-complete-bind') !== null) // Complete Bind
       this.setEvent('complete-bind', _domElement.getAttribute('en-event-complete-bind'));

     // done
     if (_domElement.getAttribute('en-event-did-mount') !== null) // Did Mount
       this.setEvent('did-mount', _domElement.getAttribute('en-event-did-mount'));
     // done
     if (_domElement.getAttribute('en-event-first-rendered') !== null) // Did Mount
       this.setEvent('first-rendered', _domElement.getAttribute('en-event-first-rendered'));


     // done
     // if (_domElement.getAttribute('en-event-will-hide') !== null) // will hide
     //   this.setEvent('will-hide', _domElement.getAttribute('en-event-will-hide'));
     //
     // // done
     // if (_domElement.getAttribute('en-event-will-show') !== null) // will show
     //   this.setEvent('will-show', _domElement.getAttribute('en-event-will-show'));

     // if (_domElement.getAttribute('en-event-will-construct-dom') !== null)
     //   this.setEvent('will-construct-dom', _domElement.getAttribute('en-event-will-construct-dom'));
     //
     // if (_domElement.getAttribute('en-event-did-construct-dom') !== null)
     //   this.setEvent('did-construct-dom', _domElement.getAttribute('en-event-did-construct-dom'));

     // 보류
     // if (_domElement.getAttribute('en-event-will-value-change') !== null) // will  value change
     //   this.setEvent('will-value-change', _domElement.getAttribute('en-event-will-value-change'));
     //
     // if (_domElement.getAttribute('en-event-did-value-change') !== null) // did value change
     //   this.setEvent('did-value-change', _domElement.getAttribute('en-event-did-value-change'));
     //
     // if (_domElement.getAttribute('en-event-will-attr-change') !== null) // will attr change
     //   this.setEvent('will-value-change', _domElement.getAttribute('en-event-will-attr-change'));
     //
     // if (_domElement.getAttribute('en-event-did-attr-change') !== null) // did attr change
     //   this.setEvent('did-value-change', _domElement.getAttribute('en-event-did-attr-change'));


     // Pipe Event 적용
     var attributes = _domElement.attributes;
     let matched;
     for (var i = 0; i < attributes.length; i++) {
       matched = attributes[i].name.match(PIPE_EVENT_SPLIT_REGEXP);

       if (matched !== null) {
         this.setPipeEvent(matched[1], attributes[i].nodeValue);
       }
     }

     // 빌드시에 참조된 DOM을 흡수하는 경우, 참조된 DOM을 forwardDOM으로 편입시키며 en Event 를 바인딩 한다.
     // 이 시점에서 Event 를 바인딩하는 이유는 Event 바인딩은 최초랜더링 시에 forwardDOM이 생성될 때만 이벤트가 바인딩 되므로
     // 참조된 DOM을 흡수하여 빌드 한 후에 랜더링때는 backupDOM으로 DOM이 생성되기 때문이다.
     if (_absorbOriginDOM === true) {
       this.forwardDOM = _domElement;
       this.forwardDOM.___en = this;
       this.isAttachedDOM = true;
       this.bindDOMEvents({}, _domElement);
     }
   }



   copyAllAtrributeFromDOMElement(_domElement) {
     this.setTagName(_domElement.nodeName);

     // __vid__ attribute를 제외하고 요소의 모든 attribute를 카피한다.
     var attributes = _domElement.attributes;
     let attrName;
     let attrValue;
     for (var i = 0; i < attributes.length; i++) {
       attrName = attributes[i].name;

       // en 으로 시작하는 모든 attribute 는 무시한다.
       if (/(^en-)|(^__vid__$)/.test(attrName)) continue;

       this.defineNewAttribute(attrName, attributes[i].nodeValue);
     }
   }


   // 편집자에 의해 Rect가 변경될 떄
   transformRectByEditor(_left, _top, _width, _height) {

     var currentRectangleRef = this.getCurrentRectangle();

     if (_left !== undefined) {
       this.setRectanglePart(_left, 'left');
     }

     if (_top !== undefined) {
       this.setRectanglePart(_top, 'top');
     }

     if (_width !== undefined) {
       this.setRectanglePart(_width, 'width');
     }

     if (_height !== undefined) {
       this.setRectanglePart(_height, 'height');
     }

   }



   import (_elementNodeDataObject) {
     super.import(_elementNodeDataObject);
     this.tagName = _elementNodeDataObject.tagName;
     this.behavior = _elementNodeDataObject.behavior;
     this.attributes = _elementNodeDataObject.attributes || [];
     this.attributes = this.attributes.map(function(_attributeO) {
       return new MetaText(_attributeO);
     });

     this.zIndex = _elementNodeDataObject.zIndex;
     this.rectangle = _elementNodeDataObject.rectangle || {
       desktop: {},
       tablet: {},
       mobile: {}
     }
   }

   export (_withoutId, _idAppender) {
     let result = super.export(_withoutId, _idAppender);
     result.behavior = this.behavior;
     result.attributes = ObjectExtends.clone(this.attributes.map(function(_attribute) {
       return _attribute.export();
     }));
     result.rectangle = ObjectExtends.clone(this.getRectangle());
     result.zIndex = this.zIndex;
     result.tagName = this.getTagName();
     result.inherentCSS = this.getCSS(); // empty 타입을 제외하고 모든 요소의 고유CSS를 익스포트한다.
     return result;
   }
 }

 export default TagBaseElementNode;