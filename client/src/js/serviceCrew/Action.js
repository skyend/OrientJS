import ActionResult from './ActionResult';

// class Action {
//   constructor(_callPoint, _targetActionKey, _params) {
//     this.callPoint = _callPoint;
//     this.targetActionKey = _targetActionKey;
//     this.params = _params; // [];
//   }
//
//   get callPoint() {
//     return this._callPoint;
//   }
//
//   get targetActionKey() {
//     return this._targetActionKey;
//   }
//
//   get params() {
//     return this._params;
//   }
//
//   set callPoint(_callPoint) {
//     this._callPoint = _callPoint;
//   }
//
//   set targetActionKey(_targetActionKey) {
//     this._targetActionKey = _targetActionKey;
//   }
//
//   set params(_params) {
//     this._params = _params;
//   }
// }

class ActionParam {
  constructor() {

  }

  get name() {
    return this._name;
  }

  set name(_name) {
    this._name = _name;
  }
}

class Action {
  constructor(_actionData) {
    this.import(_actionData);
  }

  get name() {
    return this._name;
  }

  get params() {
    return this._params;
  }

  get actionBody() {
    return this._actionBody;
  }

  set name(_name) {
    this._name = _name;
  }

  set params(_params) {
    this._params = _params;
  }

  set actionBody(_actionBody) {
    this._actionBody = _actionBody;
  }

  /*
    _argsMap: action 이 필요로 하는 param 데이터 맵
    _caller : action이 실행 될 때 this에 바인딩 될 오브젝트
    _window : 현재의 러닝 Frame 의 window 객체
    _notice: action실행이 완료되고 통지할 callback

    Action Context에 삽입되는 고정 Params
      _event : ElementNode가 생성한 이벤트 객체 --- from ElementNode __executeTask
      _originEvent : DomEvent 로 인해 발생되었을 경우의 Dom Event 객체 --- from ElementNode __executeTask
      _prevResult : 이전 Action이 실행되어 반환한 actionResult 객체 chain 된 액션의 경우 삽입 --- from ElementNode __executeTask
      _actionResult : 새로운 ActionResult 인스턴스
      //_ActionResult : 새로운 ActionResult 인스턴스를 생성 할 수 있는 ActionResult 클래스 -- 사용안함
      addReturn : 반환값을 키와 밸류로 입력
      setChain  : 이용가능 한 체인 명 지정
      _callback : Action 실행이 완료 되었을 때 호출하는 Callback 메서드. 인자로 actionResult 인스턴스를 입력하여야 한다.
  */
  execute(_argsMap, _caller, _upperActionResult, _notice) {
    let functionParamDefineArray = []; // 제일 마지막 요소는 function의 body 이자 action의 body가 삽입된다.
    let actionArgArray = []; //action이 실행 될 때 입력될 인수 배열 위의 functionParamDefineArray와 각각의 요소가 (마지막을 제외한.body)대응해야 한다.
    let emptyActionResult = new ActionResult();
    emptyActionResult.setUpperActionResult(_upperActionResult);

    // action ArgArray 의 배치구조
    // actionParam, ... , actionResult instance, _ActionResult Class, _callback(Callback)
    Object.keys(_argsMap).map(function(_argKey) {
      functionParamDefineArray.push(_argKey);
      actionArgArray.push(_argsMap[_argKey]);
    });

    // actionResult instance 삽입
    functionParamDefineArray.push('_actionResult');
    actionArgArray.push(emptyActionResult);

    functionParamDefineArray.push('addReturn');
    actionArgArray.push(function(_returnKey, _returnValue) {
      emptyActionResult.returns[_returnKey] = _returnValue;
    });

    functionParamDefineArray.push('setChain');
    actionArgArray.push(function(_chainCode) {
      emptyActionResult.code = _chainCode;
    });

    // // ActionResult Class 삽입 Action내에서 한번이상 End Callback 이 호출 될 때 데이터 공간을 공유하여
    // // 오동작이 발생하는 것을 방지
    // // 필요 할 때 사용가능
    // functionParamDefineArray.push('_ActionResult');
    // actionArgArray.push(ActionResult);

    // action callback
    functionParamDefineArray.push('_callback');
    actionArgArray.push(function(_actionResult) {
      // callback 에서 받은 _actionResult를 그대로 반환한다.
      _notice(_actionResult);
    });

    // functionParamDefineArray.push("__window__");
    // actionArgArray.push(_window);

    //functionParamDefineArray.push('with(__window__){' + this.actionBody + '}');
    functionParamDefineArray.push(this.actionBody);
    let vfunc = Function.constructor.apply(null, functionParamDefineArray);

    vfunc.apply(_caller, actionArgArray);
  }

  import (_actionData) {
    this.name = _actionData.name;
    this.params = _actionData.params;
    this.actionBody = _actionData.actionBody;
  }

  export () {
    return {
      name: this.name,
      params: this.params,
      actionBody: this.actionBody
    }
  }
}

export default Action;