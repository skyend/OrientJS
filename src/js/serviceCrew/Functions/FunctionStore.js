import _Function from '../Function';
import ArrayHandler from '../../util/ArrayHandler';

const NEW_CHECK = '082dc829-7b48-4107-b119-f8ec2f0d9ecc';

// Singletone 클래스
// Gelato가 기본으로 지원하는 Function을 포함하여 사용자가 입력한 CustomFunction 모두를 제공하는 FunctionStore 이다.
let instance = null;
class FunctionStore {
  static instance() {
    if (instance === null) instance = new FunctionStore(NEW_CHECK);

    return instance;
  }

  constructor(_NEW_CHECK) {
    this.functions = [];

    if (_NEW_CHECK !== NEW_CHECK) {
      throw new Error("FunctionStore를 직접 생성 하실 수 없습니다. FunctionStore.instance() 로 인스턴스를 얻으세요.");
    }

    if (instance !== null) throw new Error("이미 FunctionStore 가 생성되어 있습니다.");
  }

  get functions() {
    return this._functions;
  }

  set functions(_functions) {
    this._functions = _functions;
  }

  /*
    _name : function Name
    _params : paramKey Array
    _functionFunction : 미리 정의된 함수 스코프를 그대로 유지한다.
  */
  registerFunction(_name, _functionFunction) {
    let oldFunction = this.getFunction(_name);

    let _function = new _Function(_name, _functionFunction);

    if (oldFunction !== null) console.warn(`동일한 Name[${_name}] 의 Function이 재정의 되었습니다. old, new`, oldFunction, _functionFunction);

    this.functions.push(_function);
  }

  getFunction(_name) {
    let index = ArrayHandler.findIndex(this.functions, function(_function) {
      return _function.name === _name;
    });

    return this.functions[index] || null;
  }
}

export default FunctionStore;