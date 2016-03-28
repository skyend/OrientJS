import Action from '../Action';
import ArrayHandler from '../../util/ArrayHandler';

const NEW_CHECK = '082dc829-7b48-4107-b119-f8ec2f0d9ecc';

// Singletone 클래스
// Gelato가 기본으로 지원하는 Action을 포함하여 사용자가 입력한 CustomAction 모두를 제공하는 ActionStore 이다.
let instance = null;
class ActionStore {
  static instance() {
    if (instance === null) instance = new ActionStore(NEW_CHECK);

    return instance;
  }

  constructor(_NEW_CHECK) {
    this.actions = [];

    if (_NEW_CHECK !== NEW_CHECK) {
      throw new Error("ActionStore를 직접 생성 하실 수 없습니다. ActionStore.instance() 로 인스턴스를 얻으세요.");
    }

    if (instance !== null) throw new Error("이미 ActionStore 가 생성되어 있습니다.");
  }

  get actions() {
    return this._actions;
  }

  set actions(_actions) {
    this._actions = _actions;
  }

  /*
    _name : action Name
    _params : paramKey Array
    _actionFunction : Parameter 정의가 되어 있지 않은 익명함수. 함수의 Body 만 추출하여 입력된다.
  */
  registerAction(_name, _params, _actionFunction) {
    let oldAction = this.getAction(_name);

    let actionFunctionString = _actionFunction.toString();
    let actionBody = actionFunctionString.substring(actionFunctionString.indexOf('{') + 1, actionFunctionString.lastIndexOf('}'));

    let action = new Action({
      name: _name,
      params: _params,
      actionBody: actionBody
    });

    if (oldAction !== null) console.warn("동일한 Name 의 Action이 재정의 되었습니다. old, new", oldAction, _actionFunction);

    this.actions.push(action);
  }

  getAction(_name) {
    let index = ArrayHandler.findIndex(this.actions, function(_action) {
      return _action.name === _name;
    });

    return this.actions[index] || null;
  }
}

export default ActionStore;