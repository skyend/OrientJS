import HTMLElementNode from './HTMLElementNode.js';

import Factory from './Factory';

import ActionStore from '../Actions/ActionStore';

import ArrayHandler from '../../util/ArrayHandler';
import BrowserStorage from '../../util/BrowserStorage';

// Actions Import
import '../Actions/RefElementNodeActions';

"use strict";

const SETTING_START_STRING = "@Settings";
const SETTING_START_STRING_LENGTH = SETTING_START_STRING.length;

const SETTING_END_STRING = "@End";
const SETTING_END_STRING_LENGTH = SETTING_END_STRING.length;

const REGEXP_REF_TARGET_MEAN = /^\[([\w\d-_]+)\](.+)$/;

const FINAL_TYPE_CONTEXT = 'ref';


class RefComponentWrapper {
  constructor() {

    this.wrapperDOM = null;
  }

  get wrapperDOM() {
    return this._wrapperDOM;
  }

  set wrapperDOM(_dom) {
    this._wrapperDOM = _dom;
  }

  // 자식이 부모에게 요청
  dettachDOMChild(_child) {
    let domnode = this.wrapperDOM;
    domnode.removeChild(_child.getDOMNode());
  }

  attachDOMChild(_idx, _mountChildDOM, _mountChild) {
    let domnode = this.wrapperDOM;

    if (_idx !== null) {

      if (domnode.childNodes[_idx]) {
        domnode.insertBefore(_mountChildDOM, domnode.childNodes[_idx]);
      } else {
        domnode.appendChild(_mountChildDOM);
      }
    } else {
      // 마운트 index가 null 인 경우 직접 mount 위치를 찾아서 자식을 붙인다.

      let prevSiblingMountedIndex = 0,
        realMountIndex, nextSibling;

      let child, childDOM, ghostChildPool, ghostChild, ghostChildDOM, breakUpperLoop = false;
      for (let j = 0; j < this.attachedDOMs.length; j++) {
        child = this.attachedDOMs[j];


        if (child.isRepeater()) {
          ghostChildPool = child.clonePool;

          for (let i = 0; i < ghostChildPool.length; i++) {
            ghostChild = ghostChildPool[i];
            ghostChildDOM = ghostChild.getDOMNode();


            if (_mountChild === ghostChild) {

              if (ghostChildDOM) {
                throw new Error(`${ghostChild.id} Component is Already mounted GhostChild.`);
              } else {
                breakUpperLoop = true;
                break;
              }
            } else {
              if (ghostChildDOM) {
                prevSiblingMountedIndex++;
              }
            }
          }

          if (breakUpperLoop) break;
        } else {
          childDOM = child.getDOMNode();

          if (child === _mountChild) {
            if (childDOM) {
              throw new Error(`${child.id} Component is Already mounted Child.`);
            } else {
              break;
            }
          } else {
            if (childDOM) {
              prevSiblingMountedIndex++;
            }
          }
        }
      }

      realMountIndex = prevSiblingMountedIndex + 1;
      nextSibling = domnode.childNodes[realMountIndex];

      if (nextSibling) {
        domnode.insertBefore(_mountChildDOM, nextSibling);
      } else {
        domnode.appendChild(_mountChildDOM);
      }
    }
  }



  ////////////////////////////////
  // Parent Interfaces Polyfill //
  ////////////////////////////////
  getScope() {
    return null;
  }
}


class RefElementNode extends HTMLElementNode {
  constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
    super(_environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    if ((Orient.bn === 'ie' && Orient.bv <= 10) || (Orient.bn === 'safari' && Orient.bv <= 534)) {
      HTMLElementNode.call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    }
    this.type = FINAL_TYPE_CONTEXT;

    this.loadedMasters = null;

    this.loadedInstance = null;
    this.loadedRefs = false;
    this.mountedRefs = false;
    this.loadedTargetId = null;

    this.masterElementNodes = [];

    // 대표 masterElementNode
    // masterElementNode 중 en-component-representer 을 지정한다.
    this.representerMasterElementNode = null;

    //this.componentWrapper = new RefComponentWrapper();
  }

  get refference() {

  }

  get refType() {
    return this._refType;
  }

  get refTargetId() {
    return this._refTargetId;
  }

  set refType(_refType) {
    // refType 은 런타임에 변경 될 수 없다.

    this._refType = _refType;
  }

  set refTargetId(_refTargetId) {
    this._refTargetId = _refTargetId;
  }

  get component() {
    return this.representerMasterElementNode;
  }

  mappingAttributes(_domNode, _options) {
    super.mappingAttributes(_domNode, _options);

    if (window.ORIENT_SHOW_SPECIAL_ATTRIBUTES) {
      if (this.refTargetId)
        _domNode.setAttribute('en-ref-target-id', this.refTargetId);
    }
  }


  // constructDOMs(_options) {
  //   let returnHolder = super.constructDOMs(_options);
  //   let that = this;
  //
  //   if (returnHolder.length === 0) {
  //
  //
  //     // 하위 masterElementNodes 의 attach상태를 변경
  //     this.masterElementNodes.map(function(_masterElementNode) {
  //       _masterElementNode.forwardDOM = null;
  //       _masterElementNode.isAttachedDOM = false;
  //
  //       if (_masterElementNode.treeExplore)
  //         _masterElementNode.treeExplore(function(_child) {
  //           _child.forwardDOM = null;
  //           _child.isAttachedDOM = false;
  //         });
  //     });
  //
  //     return returnHolder;
  //   }
  //
  //
  //
  //   let targetId = _options.resolve ? this.interpret(this.refTargetId) : this.refTargetId;
  //
  //
  //   if (!targetId) {
  //     this.print_console_error("Reference target is '" + targetId + "' from string '" + this.refTargetId + "' ");
  //   }
  //
  //   if (this.loadedTargetId === null || this.loadedTargetId !== targetId || this.refAlwaysRemount) {
  //     that.componentRepresenter = null;
  //
  //
  //     that.tryEventScope('ref-will-mount', {
  //
  //     }, null, (_result) => {
  //       this.loadComponent(targetId, (_masterElementNodes, _componentSettings) => {
  //
  //
  //         // 일반 env_include 는 처리만 실행한다.
  //         if (_componentSettings['env_include']) {
  //           this.processingCSetting_include(_componentSettings['env_include']);
  //         }
  //
  //         // env_include_async 는 처리를 실행 후 완료후에 _callback을 실행한다.
  //
  //         if (_componentSettings['env_include_async']) {
  //           if (this.refAsync === false) {
  //             // 경고
  //             // component load type is
  //             // component will be load by async. because component load type is sync, but dependent resource is async
  //             // 컴포넌트는 비동기로 로딩될 것 이다. 컴포넌트 로딩 타입은 동기 이지만 비동기로 로딩되는 리소스 자원을 가지기 때문이다.
  //             console.warn(`Warnning : Component will be load by async. because component load type is sync, but component has asynchronous dependence resources.\n${this.DEBUG_FILE_NAME_EXPLAIN} <Component: ${_targetId}>`);
  //           }
  //
  //           this.processingCSetting_include_async(_componentSettings['env_include_async'], () => {
  //             that.mountComponentBegin(_options, _masterElementNodes, targetId, _componentSettings, () => {
  //
  //             });
  //           });
  //         } else {
  //           that.mountComponentBegin(_options, _masterElementNodes, targetId, _componentSettings, () => {
  //
  //           });
  //         }
  //
  //
  //
  //       });
  //
  //
  //
  //       that.tryEventScope('ref-did-mount', {
  //
  //       }, null, (_result) => {
  //
  //       });
  //     });
  //
  //   } else {
  //     if (this.masterElementNodes) {
  //       //
  //       // this.scopeNodes.map(function(_scopeNode) {
  //       //   if (_scopeNode.type === 'param') {
  //       //     that.masterElementNodes.setParam(_scopeNode.name, that.interpret(_scopeNode.plainValue));
  //       //   }
  //       // });
  //
  //
  //       let masterElementNode;
  //       for (let i = 0; i < this.masterElementNodes.length; i++) {
  //         masterElementNode = this.masterElementNodes[i];
  //
  //         for (let i = 0; i < this.attributes.length; i++) {
  //           masterElementNode.setProperty(this.attributes[i].name, this.interpret(this.attributes[i].variable));
  //         }
  //
  //         // let prevForwardDOM = masterElementNode.getDOMNode();
  //         masterElementNode.update(_options);
  //         //masterElementNode.attachForwardDOM(that.forwardDOM);
  //       }
  //     }
  //   }
  //
  //
  //   return returnHolder;
  // }

  attachDOMChild(_idx, _mountChildDOM, _mountChild) {
    let domnode = this.getDOMNode();

    if (_idx !== null) {

      if (domnode.childNodes[_idx]) {
        domnode.insertBefore(_mountChildDOM, domnode.childNodes[_idx]);
      } else {
        domnode.appendChild(_mountChildDOM);
      }
    } else {
      // 마운트 index가 null 인 경우 직접 mount 위치를 찾아서 자식을 붙인다.

      let prevSiblingMountedIndex = 0,
        realMountIndex, nextSibling;

      let child, childDOM, ghostChildPool, ghostChild, ghostChildDOM, breakUpperLoop = false;
      for (let j = 0; j < this.masterElementNodes.length; j++) {
        child = this.masterElementNodes[j];


        if (child.isRepeater()) {
          ghostChildPool = child.clonePool;

          for (let i = 0; i < ghostChildPool.length; i++) {
            ghostChild = ghostChildPool[i];
            ghostChildDOM = ghostChild.getDOMNode();


            if (_mountChild === ghostChild) {

              if (ghostChildDOM) {
                throw new Error(`${ghostChild.id} Component is Already mounted GhostChild.`);
              } else {
                breakUpperLoop = true;
                break;
              }
            } else {
              if (ghostChildDOM) {
                prevSiblingMountedIndex++;
              }
            }
          }

          if (breakUpperLoop) break;
        } else {
          childDOM = child.getDOMNode();

          if (child === _mountChild) {
            if (childDOM) {
              throw new Error(`${child.id} Component is Already mounted Child.`);
            } else {
              break;
            }
          } else {
            if (childDOM) {
              prevSiblingMountedIndex++;
            }
          }
        }
      }

      realMountIndex = prevSiblingMountedIndex + 1;
      nextSibling = domnode.childNodes[realMountIndex];

      if (nextSibling) {
        domnode.insertBefore(_mountChildDOM, nextSibling);
      } else {
        domnode.appendChild(_mountChildDOM);
      }
    }
  }

  unmountComponent(_options) {

    if (this.mountedRefs) {
      for (let i = 0; i < this.masterElementNodes.length; i++) {
        this.masterElementNodes[i].render(_options, true);
      }
    }

    // unmount는 자식먼저 unmount를 진행한 후 자신도 진행하도록 한다.
    super.unmountComponent(_options);
  }

  mountComponent(_options, _parentCount, _mountIndex) {
    super.mountComponent(_options, _parentCount, _mountIndex);

    this.renderRefComponents(_options);
  }

  updateComponent(_options, _parentCount, _mountIndex) {
    super.updateComponent(_options, _parentCount, _mountIndex);

    this.renderRefComponents(_options);
  }

  renderRefComponents(_options) {
    if (this.isDynamicContext()) {
      if (this.dynamicContext) {
        if (!this.dynamicContext.isLoaded)
          return;
      } else {
        return;
      }
    }




    let targetId = _options.resolve ? this.interpret(this.refTargetId) : this.refTargetId;

    if (!targetId) {
      this.print_console_error("Reference target is '" + targetId + "' from string '" + this.refTargetId + "' ");
    }

    if ((this.loadedRefs) && this.loadedTargetId === targetId) {
      console.log('Mounted refs', this.id, this.getDOMNode());
      let masterElementNode;
      for (let i = 0; i < this.masterElementNodes.length; i++) {

        masterElementNode = this.masterElementNodes[i];

        for (let i = 0; i < this.attributes.length; i++) {
          masterElementNode.setProperty(this.attributes[i].name, this.interpret(this.attributes[i].variable));
        }

        masterElementNode.render(_options);
      }
    } else {
      if (this.mountedRefs) {

        for (let i = 0; i < this.masterElementNodes.length; i++) {
          this.masterElementNodes[i].render({}, true);
        }
      }


      let upperDetacher = this.getRenderDetacher();
      upperDetacher.registerReadyHolder('ref', this);






      this.componentRepresenter = null;
      this.loadComponent(targetId, (_masterElementNodes, _componentSettings) => {
        this.loadedRefs = true;
        this.loadedTargetId = targetId;


        // 일반 env_include 는 처리만 실행한다.
        if (_componentSettings['env_include']) {
          this.processingCSetting_include(_componentSettings['env_include']);
        }

        // env_include_async 는 처리를 실행 후 완료후에 _callback을 실행한다.

        if (_componentSettings['env_include_async']) {
          if (this.refAsync === false) {
            // 경고
            // component load type is
            // component will be load by async. because component load type is sync, but dependent resource is async
            // 컴포넌트는 비동기로 로딩될 것 이다. 컴포넌트 로딩 타입은 동기 이지만 비동기로 로딩되는 리소스 자원을 가지기 때문이다.
            console.warn(`Warnning : Component will be load by async. because component load type is sync, but component has asynchronous dependence resources.\n${this.DEBUG_FILE_NAME_EXPLAIN} <Component: ${_targetId}>`);
          }

          this.processingCSetting_include_async(_componentSettings['env_include_async'], () => {
            this.mountComponentBegin(_options, _masterElementNodes, targetId, _componentSettings);
            this.mountedRefs = true;
          });
        } else {
          this.mountComponentBegin(_options, _masterElementNodes, targetId, _componentSettings);
          this.mountedRefs = true;
        }


      });
    }
  }

  mountComponentBegin(_options, _masterElementNodes, targetId, _componentSettings, _callback) {

    if (!_masterElementNodes) {
      this.print_console_error(`Fragment Load Warning. "${targetId}" was not load.`);
      return;
    }


    this.masterElementNodes = _masterElementNodes;

    this.loadedTargetId = targetId;

    // that.scopeNodes.map(function(_scopeNode) {
    //   if (_scopeNode.type === 'param') {
    //     that.loadedInstance.setParam(_scopeNode.name, that.interpret(_scopeNode.plainValue));
    //   }
    // });

    // for (let i = 0; i < that.attributes.length; i++) {
    //   that.loadedInstance.setParam(_scopeNode.name, that.interpret(that.attributes[i]));
    // }
    if (this.masterElementNodes.length === 1) {
      this.representerMasterElementNode = this.masterElementNodes[0];
    }

    let masterElementNode;
    let masterElementNodesReadiesCount = 0;

    for (let i = 0; i < this.masterElementNodes.length; i++) {

      masterElementNode = this.masterElementNodes[i];
      if (masterElementNode.componentRepresenter) {
        this.representerMasterElementNode = masterElementNode;
      }

      for (let i = 0; i < this.attributes.length; i++) {
        masterElementNode.setProperty(this.attributes[i].name, this.interpret(this.attributes[i].variable));
      }



      masterElementNode.setDebuggingInfo('FILE_NAME', targetId);

      masterElementNode.setParent(null);
      masterElementNode.upperContainer = this;
      masterElementNode.componentOwner = this;
      masterElementNode.render(_options, false, i);



    }


    // after include 처리
    if (_componentSettings) {

      if (_componentSettings.env_after_include) {
        this.processingCSetting_include(_componentSettings.env_after_include);
      }

      if (_componentSettings.env_after_include_async) {
        this.processingCSetting_include_async(_componentSettings.env_after_include_async);
      }
    }


  }

  applyHiddenState() {
    super.applyHiddenState();

    let masterElementNode;
    for (let i = 0; i < this.masterElementNodes.length; i++) {
      masterElementNode = this.masterElementNodes[i];

      masterElementNode.applyHiddenState();
    }

  }

  buildByElement(_domElement, _absorbOriginDOM) {
    super.buildByElement(_domElement, _absorbOriginDOM);

    let attributes = _domElement.attributes;
    let attr;

    if (_domElement.getAttribute('en-ref-target-id') !== null)
      this.refTargetId = _domElement.getAttribute('en-ref-target-id');

    if (_domElement.getAttribute('en-ref-async') !== null)
      this.refAsync = _domElement.getAttribute('en-ref-async') || true;

    if (_domElement.getAttribute('en-ref-remount-always') !== null)
      this.refAlwaysRemount = _domElement.getAttribute('en-ref-remount-always') || true;

    if (_domElement.getAttribute('en-event-ref-will-mount') !== null) // Did Mount
      this.setEvent('ref-will-mount', _domElement.getAttribute('en-event-ref-will-mount'));

    if (_domElement.getAttribute('en-event-ref-did-mount') !== null) // Did Mount
      this.setEvent('ref-did-mount', _domElement.getAttribute('en-event-ref-did-mount'));
  }

  appendChild(_elementNode) {
    this.children = [];
    super.appendChild(_elementNode);
    this.refType = RefferenceType.ElementNode;
    this.refTargetId = _elementNode.id;

    return true;
  }

  loadComponent(_targetId, _complete) {
    let that = this;
    let matchedTargetId = _targetId.match(REGEXP_REF_TARGET_MEAN);
    let type;
    let targetId;
    // targetId -> [html]aa.html or aa.html or [html]aa
    if (matchedTargetId !== null) {
      type = matchedTargetId[1];
      targetId = matchedTargetId[2];
    } else {
      targetId = _targetId;
      let matches = targetId.match(/\.(\w+)$/);
      if (matches === null) return this.print_console_error(`'${targetId}' is Invalid Target ID.`);
      type = matches[1];
    }

    if (window.ORIENT_REF_COMPONENT_CACHING) {
      let cacheCheck = this.readCachedComponentJSON(_targetId, (_masterElementNodes, _settings) => {
        if (_masterElementNodes !== null) {
          _complete(_masterElementNodes, _settings);
        }
      });

      if (cacheCheck) {
        return;
      }
    }


    let loaderFunction;
    if (this.environment) {
      if (this.refAsync) {
        loaderFunction = this.environment.retriever.loadComponentSheet.bind(this.environment.retriever);
      } else {
        loaderFunction = this.environment.retriever.loadComponentSheetSync.bind(this.environment.retriever);
      }

      if (window.ORIENT_REF_FORCE_ASYNC) loaderFunction = this.environment.retriever.loadComponentSheet;


      loaderFunction(targetId, (_responseSheet) => {
        if (!_responseSheet) throw new Error(`Not found component sheet. <target:${targetId}> ${this.DEBUG_FILE_NAME_EXPLAIN}`);

        this.interpretComponentSheet(type, _responseSheet, _targetId, (_masterElementNodes, _settings) => {
          if (window.ORIENT_REF_COMPONENT_CACHING) this.cachingComponentJSON(_targetId, _masterElementNodes, _settings);

          _complete(_masterElementNodes, _settings);
        });
      });
    } else {
      if (this.refAsync) {
        loaderFunction = Orient.HTTPRequest.request.bind(Orient.HTTPRequest);
      } else {
        loaderFunction = Orient.HTTPRequest.requestSync.bind(Orient.HTTPRequest);
      }

      if (window.ORIENT_REF_FORCE_ASYNC) loaderFunction = Orient.HTTPRequest.request;

      loaderFunction('get', targetId, {}, (_err, _res) => {
        if (_err !== null) throw new Error("fail static component loading");

        let responseText = _res.text;
        this.interpretComponentSheet(type, responseText, _targetId, (_masterElementNodes, _settings) => {
          if (window.ORIENT_REF_COMPONENT_CACHING) this.cachingComponentJSON(_targetId, _masterElementNodes, _settings);

          _complete(_masterElementNodes, _settings);
        });
      });
    }
  }

  cachingComponentJSON(_name, _masterElementNodes, _settings) {
    let masterElementNodes = [];

    masterElementNodes = _masterElementNodes.map(function(_masterElementNode) {

      return _masterElementNode.export();
    });

    BrowserStorage.setLocal(`_component_${_name}`, {
      component: masterElementNodes,
      settings: _settings
    });
  }

  readCachedComponentJSON(_name, _callback) {
    let componentData = BrowserStorage.getLocal(`_component_${_name}`);

    if (componentData) {
      _callback(Factory.convertToMasterElementNodesByJSONSheet(componentData.component, {}, this.environment), componentData.settings);
      return true;
    } else {
      _callback(null);
      return false;
    }
  }



  convertMastersByType(_type, _props = {}, _responseText) {
    if (_type === 'html') {
      return Factory.convertToMasterElementNodesByHTMLSheet(_responseText, _props, this.environment);
    } else if (_type === 'json') {
      return Factory.convertToMasterElementNodesByJSONSheet(JSON.parse(_responseText), _props, this.environment);
    } else if (_type === 'js') {
      // return Factory.extractByJSModule(_responseText, this.environment);
    }
  }

  // masterElementNode 들과 setting 오브젝트를 반환
  interpretComponentSheet(_type, _sheet, _targetId, _callback) {
    console.time(`Build Component Sheet - ${_targetId}`);

    let masterElementNodes;
    try {
      masterElementNodes = this.convertMastersByType(_type, undefined, _sheet);
    } catch (_e) {
      this.print_console_error(`Fail build ${_targetId} to components. native:${_e} \n${this.DEBUG_FILE_NAME_EXPLAIN}\n${_sheet}`);
    }

    console.timeEnd(`Build Component Sheet - ${_targetId}`);

    if (_type === 'html') {
      let matcher = /^<!--[\n\s]+@Settings/g;

      if (_sheet.match(matcher) !== null) {
        let settingStartCursor = _sheet.indexOf(SETTING_START_STRING),
          settingEndCursor = _sheet.indexOf(SETTING_END_STRING),
          settingCommentEndCursor = _sheet.indexOf('-->');

        if (settingEndCursor < settingCommentEndCursor) {
          let settingsBlock = _sheet.slice(settingStartCursor + SETTING_START_STRING_LENGTH, settingEndCursor);

          let componentSettingObject = this.htmlSettingBlockInterpret(settingsBlock);

          // 일반 env_include 는 처리만 실행한다.
          // if (componentSettingObject['env_include']) {
          //   this.processingCSetting_include(componentSettingObject['env_include']);
          // }
          //
          //
          // // env_include_async 는 처리를 실행 후 완료후에 _callback을 실행한다.
          //
          // if (componentSettingObject['env_include_async']) {
          //   if (this.refAsync === false) {
          //     // 경고
          //     // component load type is
          //     // component will be load by async. because component load type is sync, but dependent resource is async
          //     // 컴포넌트는 비동기로 로딩될 것 이다. 컴포넌트 로딩 타입은 동기 이지만 비동기로 로딩되는 리소스 자원을 가지기 때문이다.
          //     console.warn(`Warnning : Component will be load by async. because component load type is sync, but component has asynchronous dependence resources.\n${this.DEBUG_FILE_NAME_EXPLAIN} <Component: ${_targetId}>`);
          //   }
          //
          //   this.processingCSetting_include_async(componentSettingObject['env_include_async'], () => {
          //
          //     _callback(masterElementNodes, componentSettingObject);
          //   });
          // } else {
          //   _callback(masterElementNodes, componentSettingObject);
          // }


          _callback(masterElementNodes, componentSettingObject);

        } else {
          throw new Error('Component Settings Block is Invalid');
        }

      } else {
        _callback(masterElementNodes, {});
      }
    } else {

      _callback(masterElementNodes, {});
    }
  }


  htmlSettingBlockInterpret(_settingBlock) {
    let settingLines = _settingBlock.split('\n');
    let settingObjects = {};

    let lineMatcher = /^@(\w+)[\s\t]+(.*);/;
    let line, matched, keyword, desc;
    for (let i = 0; i < settingLines.length; i++) {
      line = settingLines[i];
      matched = line.match(lineMatcher);

      if (matched !== null) {
        keyword = matched[1];
        desc = matched[2];


        switch (keyword) {
          case "env_include_async":
          case "env_include":
          case "env_after_include":
          case "env_after_include_async":
            if (settingObjects[keyword] === undefined) {
              settingObjects[keyword] = [];
            }

            settingObjects[keyword].push(desc);
            break;
          case "trace":
            settingObjects['trace'] = true;
            break;
          default:
            throw new Error(`${keyword} is not supported setting.`);
        }
      }
    }

    return settingObjects;
  }

  processingCSetting_include(_includeList, _callback) {

    let includeList = _includeList.map((_include) => {
      return this.interpret(eval(_include));
    });

    this.environment.orbitDocument.loadReferencingElementParallel(undefined, includeList, () => {
      _callback && _callback();
    });
  }

  processingCSetting_include_async(_includeList, _callback) {

    let includeList = _includeList.map((_include) => {
      return this.interpret(eval(_include));
    });

    this.environment.orbitDocument.loadReferencingElementSerial(undefined, includeList, () => {

      _callback && _callback();
    });
  }

  // 자신에게 로드된 masterElementNodes중 해당 ID를 가진 컴포넌트를 찾아 반환한다.
  findLoadedComponent(_en_id) {
    let foundIndex = ArrayHandler.findIndex(this.masterElementNodes, (_masterElementNode) => {
      return _masterElementNode.id === _en_id;
    });

    if (foundIndex > -1) {
      return this.masterElementNodes[foundIndex];
    }

    throw new Error(`Not found Component#${_en_id} in ${this.interpret(this.refTargetId)}. ${this.DEBUG_FILE_NAME_EXPLAIN}`);
  }

  resetRefInstance() {
    this.loadedRefs = false;
    this.loadedInstance = null;
  }

  // 자신의 component가 include 될 공간을 청소한다.
  clearContainer() {
    let dom = this.forwardDOM;

    while (dom.childNodes.length > 0) {
      dom.removeChild(dom.childNodes[0]);
    }
  }

  import (_elementNodeDataObject) {
    let result = super.import(_elementNodeDataObject);
    this.refTargetId = _elementNodeDataObject.reftid;
    this.refAsync = _elementNodeDataObject.refasync || false;
    this.refAlwaysRemount = _elementNodeDataObject.refar || false;
    return result;
  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    result.reftid = this.refTargetId;
    result.refasync = this.refAsync;
    result.refar = this.refAlwaysRemount;
    return result;
  }
}

export default RefElementNode;