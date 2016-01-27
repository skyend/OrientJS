class ScopeMember {
  constructor(_scopeData) {
    this.import(_scopeData);
  }

  // Dom 으로부터 기본 scope 필드를 추출하여 반환한다.
  static BuildScopeSpecObjectByScopeDom(_dom) {
    let scopeSpecObject = {};
    scopeSpecObject.name = _dom.getAttribute('name');
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
  }

  export () {
    let exportObject = {};
    exportObject.name = this.name;
    exportObject.type = this.type;

    return exportObject;
  }
}

export default ScopeMember;
