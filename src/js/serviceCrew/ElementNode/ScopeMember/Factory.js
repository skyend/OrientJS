import ValueScopeMember from './ValueScopeMember';
import ActionScopeMember from './ActionScopeMember';
import TaskScopeMember from './TaskScopeMember';

class ScopeMember {
  static getClass(_type) {
    switch (_type) {
      case 'value':
        return ValueScopeMember;
      case 'task':
        return TaskScopeMember;
      case 'action':
        return ActionScopeMember;
    }
  }
}

export default ScopeMember;
