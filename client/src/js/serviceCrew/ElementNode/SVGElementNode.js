import HTMLElementNode from './HTMLElementNode.js';
import Factory from './Factory';
"use strict";

const RESERVED_DOM_ATTRIBUTES = {
  'value': {
    sync_field: 'value'
  },

  'checked': {
    sync_field: 'checked'
  },

  'selected-index': {
    sync_field: 'selectedIndex'
  },

  'selected-item': {
    sync_field: 'selectedItem'
  },

  'selected': {
    sync_field: 'selected'
  }
}

const ATTRIBUTE_STATE = {
  OLD: -1,
  NOT_MODIFIED: 0,
  NEW: 1,
  MODIFIED: 2
};

const XML_NS = "http://www.w3.org/2000/svg";

const FINAL_TYPE_CONTEXT = 'svg';
class SVGElementNode extends HTMLElementNode {
  static get XML_NS() {
    return XML_NS;
  }

  constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
    super(_environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    if (Orient.IS_LEGACY_BROWSER) {
      HTMLElementNode.call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    }
    this.type = FINAL_TYPE_CONTEXT;
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

    return htmlDoc.createElementNS(XML_NS, this.getTagName());
  }

  mappingAttributeDirect(_dom, _name, _value) {
    let attrNS = null;
    let matchedNS = _name.match(/^x(\w+):?/);
    console.log('>>33', _name,matchedNS);
    if( matchedNS ){
      console.log('>>22', matchedNS);
      let subNS = matchedNS[0];

      if( subNS == 'link' ){
        console.log('xlink')
        attrNS = 'http://www.w3.org/1999/xlink';
      }
    }

    _dom.setAttributeNS(attrNS, _name, _value);
  }


  mappingAttributes(_domNode, _options) {

    let oldAttributes = _domNode.attributes;
    let calculatedAttr = {};
    let attrName;
    let attrValue;
    for (let i = 0; i < _domNode.attributes.length; i++) {
      attrName = oldAttributes[i].nodeName;
      attrValue = oldAttributes[i].nodeValue;

      calculatedAttr[attrName] = {
        v: attrValue, // value
        s: ATTRIBUTE_STATE.OLD // state // OLD 어트리뷰트는 삭제된다.
      };
    }

    for (let i = 0; i < this.attributes.length; i++) {
      attrName = this.attributes[i].name;
      attrValue = this.attributes[i].variable;
      attrValue = _options.resolve ? this.interpret(attrValue) : attrValue;

      if (attrValue !== null) {
        if (attrValue instanceof Object) {

          if (attrName === 'style') {
            /*
              convert
              {
                fontFamily : 'sans-serif',
                WebkitTransition: 'none'
              }
              to
              >  font-family:'sans-serif';-webkit-transition:'none';
            */
            let styleKeys = Object.keys(attrValue);
            let toInlineStyleStringArray = styleKeys.map(function(_key) {
              return _key.replace(/([A-Z])/g, function(_full, _capital) {
                return '-' + _capital.toLowerCase();
              }) + ':' + attrValue[_key];
            });

            attrValue = toInlineStyleStringArray.join(';');
          }
        }


        if (calculatedAttr[attrName] && calculatedAttr[attrName].v == attrValue) {

          calculatedAttr[attrName].s = ATTRIBUTE_STATE.NOT_MODIFIED;
        } else {
          calculatedAttr[attrName] = {
            v: attrValue,
            s: ATTRIBUTE_STATE.MODIFIED
          };

          // calculatedAttr[attrName].v = attrValue;
          // calculatedAttr[attrName].s = ATTRIBUTE_STATE.MODIFIED;
        }
      }
    }

    let calculatedAttrKeys = Object.keys(calculatedAttr);
    // console.log('calculatedAttr::',calculatedAttr);
    let state, name, value,attrNS = null,matchedNS = null,subNS = null;
    for (let i = 0; i < calculatedAttrKeys.length; i++) {
      name = calculatedAttrKeys[i];
      state = calculatedAttr[name].s;
      value = calculatedAttr[name].v;

      if (state === ATTRIBUTE_STATE.OLD) {
        if (RESERVED_DOM_ATTRIBUTES[name]) {
          _domNode[RESERVED_DOM_ATTRIBUTES[name].sync_field] = null;
        }

        _domNode.removeAttribute(name);
      } else if (state === ATTRIBUTE_STATE.MODIFIED) {
        if (RESERVED_DOM_ATTRIBUTES[name]) {
          if (_domNode[RESERVED_DOM_ATTRIBUTES[name].sync_field] != value)
            _domNode[RESERVED_DOM_ATTRIBUTES[name].sync_field] = value;
        }

        matchedNS = name.match(/^(\w+):/);
        attrNS = null;
        if( matchedNS ){
          subNS = matchedNS[1];
          if ( subNS == 'xmlns' ){
            attrNS = 'http://www.w3.org/2000/xmlns/';
          } else if( subNS == 'xlink' ){
            attrNS = 'http://www.w3.org/1999/xlink';
          }



          let attrs = this.getAttributesByAttributeList(_domNode, name);
          let nsurl = null;
          if( attrs.length > 0 ){
            for( let ai = 0; ai < attrs.length; ai++ ){
              nsurl = attrs[ai].namespaceURI;

              if( nsurl ){
                try{
                  _domNode.setAttributeNS(nsurl, name, value);
                } catch(_e){
                  // _domNode.setAttribute(name, value);
                  // console.log('ERRORERRORERRORERROR 1', name,nsurl,_e)
                }
              } else {
                _domNode.setAttribute(name, value);
              }

            }

          } else {
            if( attrNS ){
              try{
                _domNode.setAttributeNS(attrNS, name, value);
              } catch(_e){
                // _domNode.setAttribute(name, value);
                // console.log('ERRORERRORERRORERROR 2', name,attrNS,_e)
              }
            } else {
              _domNode.setAttribute(name, value);
            }
          }

        } else {
          _domNode.setAttribute(name, value);
        }
      }
    }





    if (window.ORIENT_SHOW_SPECIAL_ATTRIBUTES) {
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
      if (this.getControl('fixed-container'))
        _domNode.setAttribute('en-ctrl-fixed-container', this.getControl('fixed-container'));

      // #DynamicContext
      if (this.dynamicContextSID)
        _domNode.setAttribute('en-dc-source-id', this.dynamicContextSID);
      if (this.dynamicContextPassive !== undefined)
        _domNode.setAttribute('en-dc-passive', String(this.dynamicContextPassive));
      if (this.dynamicContextRID)
        _domNode.setAttribute('en-dc-request-id', this.dynamicContextRID);
      if (this.dynamicContextNS)
        _domNode.setAttribute('en-dc-ns', this.dynamicContextNS);
      if (this.dynamicContextSync)
        _domNode.setAttribute('en-dc-sync', '');
      if (this.dynamicContextInjectParams)
        _domNode.setAttribute('en-dc-inject-params', this.dynamicContextInjectParams);

      if (this.dynamicContextLocalCache)
        _domNode.setAttribute('en-dc-local-cache', this.dynamicContextLocalCache);

      if (this.dynamicContextSessionCache)
        _domNode.setAttribute('en-dc-session-cache', this.dynamicContextSessionCache);

      // #Events
      // dom defaults events
      if (this.getEvent('click'))
        _domNode.setAttribute('en-event-click', this.getEvent('click'));

      if (this.getEvent('mouseenter'))
        _domNode.setAttribute('en-event-mouseenter', this.getEvent('mouseenter'));

      if (this.getEvent('complete-bind'))
        _domNode.setAttribute('en-event-complete-bind', this.getEvent('complete-bind'));
    }
  }

 getAttributesByAttributeList(_dom, _name){
    var nodes = [];
    for( var i =0; i < _dom.attributes.length;i++ ){
      if( _dom.attributes[i].nodeName == _name ){
        nodes.push( _dom.attributes[i] );
      }
    }

    return nodes;
  }
}



export default SVGElementNode;
