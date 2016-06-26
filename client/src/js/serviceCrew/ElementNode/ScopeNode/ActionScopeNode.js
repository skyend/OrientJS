import ScopeNode from './ScopeNode';

import ObjectExtends from '../../../util/ObjectExtends';

let DomAttrMatcher = new RegExp("(\\w+?)-([\\w+-_]+)");
//const ACTION_DESC_START_CAPTURE_REGEXP = /^[\s\t]*\![\s\t]*?function/;
const ACTION_START_CAPTURE_REGEXP = /^[\s\t]*\![\s\t]*?function/;

class ActionScopeNode extends ScopeNode {
  constructor(_scopeData) {
    super(_scopeData);
    if ((Orient.bn === 'ie' && Orient.bv <= 10) || (Orient.bn === 'safari' && Orient.bv <= 534)) {
      ScopeNode.call(this, _scopeData);
    }

    this.type = 'action';

  }

  static CreateByScopeDom(_scopeDom) {
    let newScopeNode = new ActionScopeNode(ActionScopeNode.BuildScopeSpecObjectByScopeDom(_scopeDom));
    //console.log(newScopeNode);
    return newScopeNode;
  }

  static BuildScopeSpecObjectByScopeDom(_dom) {
    let attr, formatMathed;
    let scopeSpecObject = ScopeNode.BuildScopeSpecObjectByScopeDom(_dom);
    let attrs = _dom.attributes;
    let length = attrs.length;

    scopeSpecObject.params = [];
    for (let i = 0; i < length; i++) {
      attr = attrs[i];
      formatMathed = attr.nodeName.match(DomAttrMatcher);

      if (formatMathed !== null) {
        if (formatMathed[1] === 'param') {
          scopeSpecObject.params.push(formatMathed[2]);
        }
      }
    }

    let actionBody = _dom.innerHTML;
    let refinedActionBody = '';
    let bodyLines = actionBody.split('\n');

    let foundStartSymbol = false;
    let line;
    bodyLines = bodyLines.map(function(_line) {
      return _line.replace(ACTION_START_CAPTURE_REGEXP, function() {
        foundStartSymbol = true;
        return 'return function';
      });
    });

    if (!foundStartSymbol) {
      throw new Error(`action needed a start symbol(!function) name:${scopeSpecObject.name} desc:${actionBody}`);
    }

    let extractorFunction = new Function(bodyLines.join('\n'));
    let extractedFunc = extractorFunction();

    if (!extractedFunc instanceof Function) {
      throw new Error(`Invalid action declare format. declared action name:${scopeSpecObject.name} desc:${actionBody}`);
    }

    // 추출한 함수를 문자열로 변환
    refinedActionBody = extractedFunc.toString();

    // function 에서 body 코드만 남도록 함
    // function ...() { 를 제거
    // function 블럭의 끝(}) 제거
    refinedActionBody = refinedActionBody.replace(/^function.*?\{/, '');
    refinedActionBody = refinedActionBody.replace(/}$/, '');

    scopeSpecObject.actionBody = refinedActionBody;

    return scopeSpecObject;
  }

  get params() {
    return this._params;
  }

  get actionBody() {
    return this._actionBody;
  }

  set params(_params) {
    this._params = _params;
  }

  set actionBody(_actionBody) {
    this._actionBody = _actionBody;
  }

  import (_scopeData) {
    super.import(_scopeData);
    this.params = _scopeData.params;
    this.actionBody = _scopeData.actionBody;
  }

  export () {
    let exportObject = super.export();
    exportObject.params = ObjectExtends.clone(this.params);
    exportObject.actionBody = this.actionBody;
    return exportObject;
  }
}

export default ActionScopeNode;