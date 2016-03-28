class ScopeNode {
  constructor(_scopeData) {
    this.import(_scopeData);
  }

  // Dom 으로부터 기본 scope 필드를 추출하여 반환한다.
  static BuildScopeSpecObjectByScopeDom(_dom) {
    let scopeSpecObject = {};

    scopeSpecObject.debug = _dom.getAttribute('debug');

    scopeSpecObject.name = _dom.getAttribute('name');
    if (!/\w+/.test(scopeSpecObject.name || '')) {
      console.info(_dom);
      throw new Error("Scope 선언에는 name 이 포함되어야 합니다.", _dom);
    }

    _dom.removeAttribute('name'); // name Attribute 를 읽었으므로 제거


    return scopeSpecObject;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  set name(_name) {
    this._name = _name;
  }

  set type(_type) {
    this._type = _type;
  }

  import (_scopeData) {
    this.name = _scopeData.name;
    this.type = _scopeData.type;
    this.debug = _scopeData.debug;
  }

  export () {
    let exportObject = {};
    exportObject.name = this.name;
    exportObject.type = this.type;
    exportObject.debug = this.debug;

    return exportObject;
  }
}

export default ScopeNode;