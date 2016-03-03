import ScopeNode from './ScopeNode';
import _ from 'underscore';


let DomAttrMatcher = new RegExp("(\\w+?)-([\\w+-_]+)");

class FunctionScopeNode extends ScopeNode {
  constructor(_scopeData) {
    super(_scopeData);
    this.type = 'function';
  }

  static CreateByScopeDom(_scopeDom) {
    let newScopeNode = new FunctionScopeNode(FunctionScopeNode.BuildScopeSpecObjectByScopeDom(_scopeDom));

    return newScopeNode;
  }

  static BuildScopeSpecObjectByScopeDom(_dom) {

    let scopeSpecObject = super.BuildScopeSpecObjectByScopeDom(_dom);

    scopeSpecObject.functionReturner = _dom.innerHTML;

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
    this.executableFunction = new Function(this.functionReturner)();
  }

  import (_scopeData) {
    super.import(_scopeData);

    this.functionReturner = _scopeData.functionReturner;

    this.extractFunction();
  }

  export () {
    let exportObject = super.export();

    exportObject.functionReturner = this.functionReturner;
    return exportObject;
  }
}

export default FunctionScopeNode;