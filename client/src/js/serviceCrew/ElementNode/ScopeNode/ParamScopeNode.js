import ValueScopeNode from './ValueScopeNode';

class ParamScopeNode extends ValueScopeNode {
  constructor(_scopeData) {
    super(_scopeData);
    if (Orient.bn === 'ie' && Orient.bv <= 10) {
      ValueScopeNode.call(this, _scopeData);
    }
    this.type = 'param';

    console.log('param scope member created');
  }


  /**
  Task Implement
  **/
  static CreateByScopeDom(_scopeDom) {
    let newScopeNode = new ParamScopeNode(ParamScopeNode.BuildScopeSpecObjectByScopeDom(_scopeDom));
    console.log(newScopeNode);
    return newScopeNode;
  }
}

export default ParamScopeNode;