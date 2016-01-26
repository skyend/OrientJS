import ValueScopeMember from './ValueScopeMember';
import ActionScopeMember from './ActionScopeMember';

class ScopeMember {
  static getClass(_type) {
    switch (_type) {
      case 'value':
        return ValueScopeMember;
      case 'action':
        return ActionScopeMember;
    }
  }
}

export default ScopeMember;