class ScopeMember {
  constructor(_scopeData) {
    this.import(_scopeData);
  }

  static BuildScopeSpecObjectByScopeDom(_dom) {
    let scopeSpecObject = {};
    scopeSpecObject.name = _dom.getAttribute('name');
    scopeSpecObject.type = _dom.getAttribute('type');
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