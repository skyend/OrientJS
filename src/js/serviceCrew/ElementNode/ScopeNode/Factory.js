import ValueScopeNode from './ValueScopeNode';
import ActionScopeNode from './ActionScopeNode';
import TaskScopeNode from './TaskScopeNode';
import ParamScopeNode from './ParamScopeNode';

class ScopeNodeFactory {
  static getClass(_type) {

    switch (_type) {
      case 'value':
        return ValueScopeNode;
      case 'task':
        return TaskScopeNode;
      case 'action':
        return ActionScopeNode;
      case 'param':
        return ParamScopeNode;
    }
  }
}

export default ScopeNodeFactory;