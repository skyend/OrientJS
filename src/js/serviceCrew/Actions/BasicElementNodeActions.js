import ActionStore from './ActionStore';
import ICEAPISource from '../ICEAPISource';
import APIFarmSource from '../APIFarmSource';
import SA_Loader from '../StandAloneLib/Loader';

window.ICEAPISource = ICEAPISource;
window.SA_Loader = SA_Loader;
window.APIFarmSource = APIFarmSource;

let actionStore = ActionStore.instance();

//
//
// regexp = {
//       empty     : function(){return /^\s*$/;},
//       email     : function(){return /^[\w\d]+@[\w\d-]+\.[\w]+$/;},
//       username  : function(){return /^[A-Za-z0-9_\-]+$/;},
//       name      : function(){return /^[\w\d\s]+$/;},
//       text      : function(){return /^[A-Za-z0-9_\-]+$/;},
//       image_file    : function(){return /\.(jpg|png|gif|jpeg)$/i;},
//       password_min_chars : function(){ return /^.{0,7}$/; },
//       password_L1   : function(){return /^[a-z]+$/;},
//       password_L2   : function(){return /^[a-z0-9]+$/;},
//       password_L3   : function(){return /^[a-zA-Z0-9]+$/;},
//       password_L4   : function(){return /^[a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\-\+\=]+$/;}
//     };

/*
Action Function Scope 내 의 고정 인자
  _event : ElementNode가 생성한 이벤트 객체 --- from ElementNode __executeTask
  _originEvent : DomEvent 로 인해 발생되었을 경우의 Dom Event 객체 --- from ElementNode __executeTask
  _prevResult : 이전 Action이 실행되어 반환한 actionResult 객체 chain 된 액션의 경우 삽입 --- from ElementNode __executeTask
  _actionResult : 새로운 ActionResult 인스턴스
  _ActionResult : 새로운 ActionResult 인스턴스를 생성 할 수 있는 ActionResult 클래스
  _callback : Action 실행이 완료 되었을 때 호출하는 Callback 메서드. 인자로 actionResult 인스턴스를 입력하여야 한다.
*/

actionStore.registerAction('refresh', ['taskChain'], function() {
  _actionResult.taskChain = taskChain;

  this.update();

  _actionResult.code = 'success';
  _callback(_actionResult);

  // this.refresh(function() {
  //   _actionResult.code = 'success';
  //   _callback(_actionResult);
  // });
});

actionStore.registerAction('refresh-to', ['eid', 'selector', 'taskChain'], function() {
  _actionResult.taskChain = taskChain;

  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.environment.findById(eid, false);
  }

  targetElementNode.update();
  _actionResult.code = 'success';

  _callback(_actionResult);

});


actionStore.registerAction('update', ['keepDC', 'resolve'], function() {

  this.update({
    keepDC: keepDC || 'false',
    resolve: resolve
  });

  _actionResult.code = 'success';
  _callback(_actionResult);

});

actionStore.registerAction('update-to', ['eid', 'taskChain'], function() {
  _actionResult.taskChain = taskChain;

  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.environment.findById(eid, false);
  }

  targetElementNode.update();
  _actionResult.code = 'success';

  _callback(_actionResult);

});

actionStore.registerAction('attr', ['name', 'value', 'taskChain'], function() {
  this.setAttribute(name, value);

  _actionResult.taskChain = taskChain;
  _actionResult.code = 'success';
  _callback(_actionResult);
});


actionStore.registerAction('set-by-plain', ['name', 'value', 'taskChain'], function() {
  let valueScope = this.getScope(name, 'value');

  valueScope.plainValue = value;

  _actionResult.taskChain = taskChain;
  _actionResult.code = 'success';
  _callback(_actionResult);
});

actionStore.registerAction('set', ['name', 'value'], function() {
  this.setValueScopeData(name, value);

  _actionResult.code = 'success';
  _callback(_actionResult);
});

actionStore.registerAction('attr-to', ['eid', 'selector', 'name', 'value', 'taskChain'], function() {
  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.environment.findById(eid, false);
  }

  targetElementNode.setAttribute(name, value);

  _actionResult.code = 'success';
  _actionResult.taskChain = taskChain;
  _callback(_actionResult);
});

actionStore.registerAction('exists-toggle-attr-to', ['eid', 'name', 'taskChain'], function() {
  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.environment.findById(eid, false);
  }

  if (targetElementNode.getAttribute(name) !== undefined) {
    targetElementNode.removeAttribute(name);
  } else {
    targetElementNode.setAttribute(name, 'on');
  }

  _actionResult.code = 'success';
  _actionResult.taskChain = taskChain;
  _callback(_actionResult);
});

actionStore.registerAction('scrollTop', ['taskChain'], function() {
  this.forwardDOM.ownerDocument.defaultView.scrollTo(0, 0);

  _actionResult.code = 'success';
  _actionResult.taskChain = taskChain;
  _callback(_actionResult);
});

actionStore.registerAction('alert', ['message', 'taskChain'], function() {
  alert(message);

  _actionResult.code = 'success';
  _actionResult.taskChain = taskChain;
  _callback(_actionResult);
});

actionStore.registerAction('move-location', ['location'], function() {
  window.location.href = location;

  _actionResult.code = 'success';
  _callback(_actionResult);
});

actionStore.registerAction('input-value-upsync', [], function() {
  let value = this.forwardDOM.value;

  this.setAttribute('value', value);

  _actionResult.code = 'success';
  _callback(_actionResult);
});

actionStore.registerAction('input-value-test', ['testRegExp'], function() {
  let value = this.forwardDOM.value;

  if (testRegExp.test(value)) {
    _actionResult.code = 'pass';
  } else {
    _actionResult.code = 'fail';
  }

  _callback(_actionResult);
});

actionStore.registerAction('input-value-validate', ['type'], function() {
  let value = this.forwardDOM.value;
  let testRegExp;

  switch (type) {
    case 'id':
      testRegExp = /^[\w\d]{6,}$/;
      break;
    case 'password':
      testRegExp = /^[\w\d\!\@\#\$\%\^\*\?\_\~]{8,}$/;
    default:

  }


  if (testRegExp.test(value)) {
    _actionResult.code = 'pass';
  } else {
    _actionResult.code = 'fail';
  }

  _callback(_actionResult);
});

actionStore.registerAction('validate', ['text', 'type'], function() {


  function validate(_regExp, _value) {

    if (_regExp.test(_value || '')) {
      return 'pass';
    } else {
      return 'fail';
    }
  }

  switch (type) {
    case 'number':
      _actionResult.code = validate(/^\d+$/, text);
      break;

    case 'words':
      _actionResult.code = validate(/^\w+$/, text);
      break;

    case 'email':
      _actionResult.code = validate(/^[\w\d]+@[\w\d-]+\.[\w]+$/, text);
      break;

    case 'password':
      _actionResult.code = validate(/^[\w\d\!\@\#\$\%\^\*\?\_\~]{8,}$/, text);
      break;

    case 'email-host':
      _actionResult.code = validate(/^[\w\d-]+\.[\w]+$/, text);
      break;

    case 'tel-number-ko':
      _actionResult.code = validate(/^\d{2,3}-\d{3,4}-\d{3,4}$/, text);
      break;

    case 'birthdate':
      _actionResult.code = validate(/^\d{4}\d{2}\d{2}$/, text);
      break;

    case 'birth-date':
      _actionResult.code = validate(/^\d{4}-\d{1,2}-\d{1,2}$/, text);
      break;

    case 'birth-day':
      _actionResult.code = validate(/^\d{1,2}-\d{1,2}$/, text);
      break;

    default:
      throw new Error("지원하지 않는 유효성 검사 타입입니다.");
  }

  _callback(_actionResult);
});

actionStore.registerAction('if', ['conditionResult'], function() {

  if (conditionResult) {
    _actionResult.code = 'true';
  } else {
    _actionResult.code = 'false';
  }

  _callback(_actionResult);
});

actionStore.registerAction('loop', ['fps'], function() {
  setInterval(function() {
    _callback(_actionResult);
  }, 1000 / fps);
});


actionStore.registerAction('sendAPISourceForm', ['apiSourceId', 'requestId'], function() {
  let that = this;
  let type = 'ice-api';
  if (/^farm\//.test(apiSourceId)) {
    type = 'farm-api';
  }

  window['SA_Loader'].loadAPISource(apiSourceId, function(_apiSourceData) {
    let apiSource;
    let fields = {};
    //let request;
    if (type === 'farm-api') {
      apiSource = new(window.APIFarmSource)(_apiSourceData);
      apiSource.setHost($ervice.page.apiFarmHost);
    } else if (type === 'ice-api') {
      apiSource = new(window.ICEAPISource)(_apiSourceData);
      apiSource.setHost($ervice.page.iceHost);
    }


    that.findChildren('[transfer-value]').map(function(_elementNode) {

      let pass = true;

      _elementNode.climbParents(function(_parent) {
        if (_parent === that) {

          return null;
        } else if (_parent.getAttribute('ignore-transfer') !== undefined) {

          pass = false;
          return null;
        }
      });

      if (pass) {
        fields[_elementNode.getAttributeWithResolve('name')] = _elementNode.getAttributeWithResolve('transfer-value');
      }
    });

    console.log("%c Transfer form", "font-size:100px; font-family: Arial, sans-serif; color:#fff;   text-shadow: 0 1px 0 #ccc,   0 2px 0 #c9c9c9, 0 3px 0 #bbb,   0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2),   0 20px 20px rgba(0,0,0,.15)");
    console.log(apiSourceId, requestId, fields);

    apiSource.executeRequest(requestId, fields, {}, that.getAttribute('enctype'), function(_result, _statusCode) {
      console.log("Result ", _result, _statusCode);

      _actionResult.code = _result.result || _statusCode;
      _actionResult.data = _result;
      _callback(_actionResult);
    });
  });
});


actionStore.registerAction('focus', ['eid'], function() {
  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.environment.findById(eid, false);
  }

  targetElementNode.forwardDOM.focus();

  _callback(_actionResult);
});

actionStore.registerAction('stopPropagation', [], function() {

  _event.originEvent.stopPropagation();

  _callback(_actionResult);
});

actionStore.registerAction('preventDefault', [], function() {

  _event.originEvent.preventDefault();

  _callback(_actionResult);
});

actionStore.registerAction('singleReturn', ['returnValue'], function() {
  _actionResult.returns = returnValue;
  _callback(_actionResult);
});

actionStore.registerAction('executeDC', [], function() {
  this.executeDynamicContext();

  _callback(_actionResult);
});

actionStore.registerAction('resetDC', [], function() {
  this.resetDynamicContext();

  _callback(_actionResult);
});

actionStore.registerAction('pipe', ['pipeName', 'pipeData'], function() {

  this.executeEventPipe(pipeName, pipeData || {}, function(_pipeResult) {

    _callback(_actionResult);
  });
});

// 배열에 값을 추가
actionStore.registerAction('push', ['name', 'value'], function() {

  this.pushToValueScopeArray(name, value);

  _callback(_actionResult);
});

// 배열에서 특정한 값을 제거
actionStore.registerAction('pop2', ['name', 'value'], function() {

  this.popToValueScopeArrayByValue(name, value);

  _callback(_actionResult);
});

//****** ElementNode default Actions *****//

console.log(actionStore);