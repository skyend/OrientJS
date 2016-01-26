import ScopeMember from './ScopeMember';

class ActionScopeMember extends ScopeMember {
  static CreateByScopeDom(_scopeDom) {
    let newScope = new ActionScopeMember();


  }

  static BuildScopeSpecObjectByScopeDom(_dom) {
    let scopeSpecObject = super.BuildScopeSpecObjectByScopeDom(_dom);
    /// todo..

    return scopeSpecObject;
  }

  constructor(_scopeData) {
    super(_scopeData);

  }

  buildByScopeDom(_scopeDom) {
    super.buildByScopeDom(_scopeDom);

  }

  import (_scopeData) {
    super.import(_scopeData);
  }

  export () {
    let exportObject = super.export();

    return exportObject;
  }
}

export default ActionScopeMember;