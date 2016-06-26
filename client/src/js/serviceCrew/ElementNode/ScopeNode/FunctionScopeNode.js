import ScopeNode from './ScopeNode';

const FUNCTION_START_CAPTURE_REGEXP = /^[\s\t]*\![\s\t]*?function/;

let DomAttrMatcher = new RegExp("(\\w+?)-([\\w+-_]+)");

class FunctionScopeNode extends ScopeNode {
  constructor(_scopeData) {
    super(_scopeData);
    if ((Orient.bn === 'ie' && Orient.bv <= 10) || (Orient.bn === 'safari' && Orient.bv <= 534)) {
      ScopeNode.call(this, _scopeData);
    }

    this.type = 'function';
  }

  static CreateByScopeDom(_scopeDom) {
    let newScopeNode = new FunctionScopeNode(FunctionScopeNode.BuildScopeSpecObjectByScopeDom(_scopeDom));

    return newScopeNode;
  }

  static BuildScopeSpecObjectByScopeDom(_dom) {

    let scopeSpecObject = ScopeNode.BuildScopeSpecObjectByScopeDom(_dom);

    let scopeBody = _dom.innerHTML;
    let lines = scopeBody.split('\n');
    lines = lines.map(function(_line) {
      return _line.replace(FUNCTION_START_CAPTURE_REGEXP, 'return function');
    });

    scopeSpecObject.functionReturner = lines.join('\n');

    return scopeSpecObject;
  }

  get functionReturner() {
    return this._functionReturner;
  }

  set functionReturner(_functionReturner) {
    this._functionReturner = _functionReturner;
  }

  get executableFunction() {
    return this._executableFunction;
  }

  set executableFunction(_executableFunction) {
    this._executableFunction = _executableFunction;
  }

  extractFunction() {
    // function Returner 를 실행하여 실제 Function을 얻는다.
    let executableFunction;
    // console.log(this.functionReturner);

    try {
      executableFunction = new Function(this.functionReturner);
      executableFunction = executableFunction();
    } catch (_e) {
      _e.message = `함수를 추출 할 수 없었습니다. <Native:${_e.message}> \nSource\n${this.functionReturner}\n`;
      throw _e;
    }

    if (typeof executableFunction === 'function') {
      this.executableFunction = executableFunction;
    } else {
      throw new Error("FunctionNode 는 반드시 함수를 반환 해야 합니다.");
    }
  }

  import (_scopeData) {
    super.import(_scopeData);

    this.functionReturner = _scopeData.functionReturner;

    if (this.functionReturner !== null) {
      this.extractFunction();
    }
  }

  export () {
    let exportObject = super.export();

    exportObject.functionReturner = this.functionReturner;
    return exportObject;
  }
}

export default FunctionScopeNode;