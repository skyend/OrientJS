import ScopeMember from './ScopeMember';

let DomAttrMatcher = new RegExp("(\\w+?)-([\\w+-_]+)");

class TaskArgument {
  constructor(_argData) {
    this.import(_argData);
    this.type = 'task';
  }

  import (_argData) {
    this.name = _argData.name;
    this.value = _argData.value;
  }

  export () {
    return {
      name: this.name,
      value: this.value
    }
  }
}

class TaskChain {
  constructor(_argData) {
    this.import(_argData);
  }

  import (_argData) {
    this.name = _argData.name;
    this.value = _argData.value;
  }

  export () {
    return {
      name: this.name,
      value: this.value
    }
  }
}


class TaskScopeMember extends ScopeMember {
  constructor(_scopeData) {
    super(_scopeData);
    this.type = 'task';

  }

  static CreateByScopeDom(_scopeDom) {
    let newScopeMember = new TaskScopeMember(TaskScopeMember.BuildScopeSpecObjectByScopeDom(_scopeDom));
    console.log(newScopeMember);
    return newScopeMember;
  }

  static BuildScopeSpecObjectByScopeDom(_dom) {
    let attr, formatMathed;
    let scopeSpecObject = super.BuildScopeSpecObjectByScopeDom(_dom);
    let attrs = _dom.attributes;
    let length = attrs.length;

    // 확장클래스에서 사용하는 attribute 읽기 및 지정
    scopeSpecObject.action = _dom.getAttribute('action');
    if (!/\w+/.test(scopeSpecObject.action || '')) throw new Error("TaskScope 선언에는 action 이 포함되어야 합니다.");

    scopeSpecObject.args = [];
    scopeSpecObject.chains = [];
    for (let i = 0; i < length; i++) {
      attr = attrs[i];
      formatMathed = attr.nodeName.match(DomAttrMatcher);
      if (formatMathed !== null) {
        if (formatMathed[1] === 'arg') {
          scopeSpecObject.args.push({
            name: formatMathed[2],
            value: attr.nodeValue
          });
        } else if (formatMathed[1] === 'chain') {
          scopeSpecObject.chains.push({
            name: formatMathed[2],
            value: attr.nodeValue
          });
        }
      }
    }

    return scopeSpecObject;
  }

  get args() {
    return this._args;
  }

  get chains() {
    return this._chains;
  }

  set args(_args) {
    this._args = _args;
  }

  set chains(_chains) {
    this._chains = _chains;
  }

  import (_scopeData) {
    super.import(_scopeData);
    this.action = _scopeData.action;
    this.args = _scopeData.args.map(function(_arg) {
      return new TaskArgument(_arg);
    });
    this.chains = _scopeData.chains.map(function(_chain) {
      return new TaskChain(_chain);
    });
  }

  export () {
    let exportObject = super.export();
    exportObject.action = this.action;
    exportObject.args = this.args.map(function(_taskArgument) {
      return _taskArgument.export();
    });
    exportObject.chains = this.chains.map(function(_taskChain) {
      return _taskChain.export();
    });

    return exportObject;
  }
}

export default TaskScopeMember;