import ScopeMember from './ScopeMember';

class TaskScopeMember extends ScopeMember {
  constructor(_scopeData) {
    super(_scopeData);
    this.type = 'task';

  }

  static CreateByScopeDom(_scopeDom) {
    let newScopeMember = new TaskScopeMember(TaskScopeMember.BuildScopeSpecObjectByScopeDom(_scopeDom));

    return newScopeMember;
  }

  static BuildScopeSpecObjectByScopeDom(_dom) {
    let scopeSpecObject = super.BuildScopeSpecObjectByScopeDom(_dom);

    // 확장클래스에서 사용하는 attribute 읽기 및 지정
    scopeSpecObject.executor = _dom.getAttribute('action');

    return scopeSpecObject;
  }
 
  import (_scopeData) {
    super.import(_scopeData);
    this.action = _scopeData.action;

  }

  export () {
    let exportObject = super.export();
    exportObject.action = this.action;

    return exportObject;
  }
}

export default TaskScopeMember;
