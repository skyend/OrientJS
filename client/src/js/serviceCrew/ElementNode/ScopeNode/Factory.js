import ValueScopeNode from './ValueScopeNode';
import ActionScopeNode from './ActionScopeNode';
import TaskScopeNode from './TaskScopeNode';
import ParamScopeNode from './ParamScopeNode';
import FunctionScopeNode from './FunctionScopeNode';

class ScopeNodeFactory {
  constructor() {

  }

  static getClass(_type) {

    switch (_type) {
      case 'value':
        return ValueScopeNode;
      case 'task':
        return TaskScopeNode;
      case 'action':
        return ActionScopeNode;
      case 'function':
        return FunctionScopeNode;
      case 'param':
        return ParamScopeNode;
    }
  }
}

export default ScopeNodeFactory;