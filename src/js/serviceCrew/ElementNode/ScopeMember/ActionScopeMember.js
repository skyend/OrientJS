import ScopeMember from './ScopeMember';

class ActionScopeMember extends ScopeMember {
  constructor(_scopeData) {
    super(_scopeData);
    this.type = 'action';

  }

  static CreateByScopeDom(_scopeDom) {
    let newScopeMember = new ActionScopeMember(ActionScopeMember.BuildScopeSpecObjectByScopeDom(_scopeDom));

    return newScopeMember;
  }

  static BuildScopeSpecObjectByScopeDom(_dom) {
    let scopeSpecObject = super.BuildScopeSpecObjectByScopeDom(_dom);

    // 확장클래스에서 사용하는 attribute 읽기 및 지정
    scopeSpecObject.executor = _dom.getAttribute('executor');

    return scopeSpecObject;
  }

  buildByScopeDom(_scopeDom) {
    super.buildByScopeDom(_scopeDom);

  }

  import (_scopeData) {
    super.import(_scopeData);
    this.executor = _scopeData.executor;

  }

  export () {
    let exportObject = super.export();
    exportObject.executor = this.executor;

    return exportObject;
  }
}

export default ActionScopeMember;