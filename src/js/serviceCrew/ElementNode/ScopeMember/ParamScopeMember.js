import ValueScopeMember from './ValueScopeMember';

class ParamScopeMember extends ValueScopeMember {
  constructor(_scopeData) {
    super(_scopeData);
    this.type = 'param';

    console.log('param scope member created');
  }


  /**
  Task Implement
  **/
  static CreateByScopeDom(_scopeDom) {
    let newScopeMember = new ParamScopeMember(ParamScopeMember.BuildScopeSpecObjectByScopeDom(_scopeDom));
    console.log(newScopeMember);
    return newScopeMember;
  }
}

export default ParamScopeMember;