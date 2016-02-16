import ScopeNode from './ScopeNode';
import _ from 'underscore';


let DomAttrMatcher = new RegExp("(\\w+?)-([\\w+-_]+)");

class ActionScopeNode extends ScopeNode {
  constructor(_scopeData) {
    super(_scopeData);
    this.type = 'action';

  }

  static CreateByScopeDom(_scopeDom) {
    let newScopeNode = new ActionScopeNode(ActionScopeNode.BuildScopeSpecObjectByScopeDom(_scopeDom));
    console.log(newScopeNode);
    return newScopeNode;
  }

  static BuildScopeSpecObjectByScopeDom(_dom) {
    let attr, formatMathed;
    let scopeSpecObject = super.BuildScopeSpecObjectByScopeDom(_dom);
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

    scopeSpecObject.actionBody = _dom.innerHTML;

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
    exportObject.params = _.clone(this.params);
    exportObject.actionBody = this.actionBody;
    return exportObject;
  }
}

export default ActionScopeNode;