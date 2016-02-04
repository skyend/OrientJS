import ValueScopeMember from './ValueScopeMember';
import ActionScopeMember from './ActionScopeMember';
import TaskScopeMember from './TaskScopeMember';
import ParamScopeMember from './ParamScopeMember';

class ScopeMemberFactory {
  static getClass(_type) {

    switch (_type) {
      case 'value':
        return ValueScopeMember;
      case 'task':
        return TaskScopeMember;
      case 'action':
        return ActionScopeMember;
      case 'param':
        return ParamScopeMember;
    }
  }
}

export default ScopeMemberFactory;