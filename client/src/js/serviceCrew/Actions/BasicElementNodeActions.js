import ActionStore from './ActionStore';
import FunctionStore from '../Functions/FunctionStore';

// import ICEAPISource from '../ICEAPISource';
// import APIFarmSource from '../APIFarmSource';
// import SA_Loader from '../StandAloneLib/Loader';

// window.ICEAPISource = ICEAPISource;
// window.SA_Loader = SA_Loader;
// window.APIFarmSource = APIFarmSource;

let actionStore = ActionStore.instance();

let functionStore = FunctionStore.instance();

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
//
// actionStore.registerAction('refresh', ['taskChain'], function() {
//   _actionResult.taskChain = taskChain;
//
//   this.update();
//
//   _actionResult.code = 'success';
//   _callback(_actionResult);
//
//   // this.refresh(function() {
//   //   _actionResult.code = 'success';
//   //   _callback(_actionResult);
//   // });
// });
//
// actionStore.registerAction('refresh-to', ['eid', 'selector', 'taskChain'], function() {
//   _actionResult.taskChain = taskChain;
//
//   let targetElementNode;
//   if (eid !== undefined) {
//     targetElementNode = this.getMaster().findById(eid, false);
//   }
//
//   targetElementNode.update();
//   _actionResult.code = 'success';
//
//   _callback(_actionResult);
// });


actionStore.registerAction('update', ['keep_dc', 'resolve'], function() {

  this.update({
    keepDC: keep_dc || false,
    resolve: resolve
  });

  _actionResult.code = 'success';
  _callback(_actionResult);

});


actionStore.registerAction('update-single', ['keep_dc', 'resolve'], function() {

  this.updateSingle({
    keepDC: keep_dc || false,
    resolve: resolve
  });

  _actionResult.code = 'success';
  _callback(_actionResult);

});

actionStore.registerAction('update-to', ['eid', 'taskChain'], function() {
  _actionResult.taskChain = taskChain;

  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.getMaster().findById(eid, false);
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

actionStore.registerAction('set-attr', ['name', 'value'], function() {
  this.setAttrR(name, value);
  _actionResult.data = {
    name: name,
    value: value
  };

  _callback(_actionResult);
});

actionStore.registerAction('toggle-val', ['name'], function() {
  let value = this.getValue(name);

  this.setValue(name, value ? false : true);

  _callback(_actionResult);
});


actionStore.registerAction('attr-to', ['eid', 'selector', 'name', 'value', 'taskChain'], function() {
  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.getMaster().findById(eid, false);
  }

  targetElementNode.setAttribute(name, value);

  _actionResult.code = 'success';
  _actionResult.taskChain = taskChain;
  _callback(_actionResult);
});

actionStore.registerAction('exists-toggle-attr-to', ['eid', 'name', 'taskChain'], function() {
  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.getMaster().findById(eid, false);
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

  if (testRegExp.test(new RegExp(value))) {
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
      _actionResult.code = validate(/^[\w\d]+@[\w\d-]+(\.[\w]+)+$/, text);
      break;

    case 'id6':
      _actionResult.code = validate(/^[\w\d]{6,}$/, text);
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
      // 19910211
      _actionResult.code = validate(/^\d{4}\d{2}\d{2}$/, text);
      break;

    case 'birth-date':
      // 1991-02-11
      _actionResult.code = validate(/^\d{4}-\d{1,2}-\d{1,2}$/, text);
      break;

    case 'birth-day':
      // 02-11
      _actionResult.code = validate(/^\d{1,2}-\d{1,2}$/, text);
      break;

    case 'has-special-character':
      _actionResult.code = validate(/[\!\@\#\$\%\^\*\?\_\~]+/, text);
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




/***
 * chainCodeCriterion : Key Name or Function
 */
functionStore.registerFunction('_sendAPISourceFormBody', function (apiSourceId, requestId, chainCodeCriterion, enctype, fields, before_chain, use_ssl,_callback){
  let that = this;


 //window.testPopup = window.open("https://dev.kolonmall.com/api/jsp/test/test.jsp", "submit-form", "directories=no, location=no, menubar=no, status=no,titlebar=no,toolbar=no,scrollbars=no,resizable=no,height=10,width=10,left=10000000,top=10000000,visible=none,alwaysLowered=yes");

  let transferFields = this.interpret("{{: func@extract-form-params() }}");

  // 추가 필드 머지
  __orient__ObjectExtends.mergeByRef(transferFields, fields || {}, true);


  let requestMethodForHTTP = 'get';
  if (this.dom().getAttribute('method')) {
    requestMethodForHTTP = this.dom().getAttribute('method');
  }

  console.log("%c Transfer form", "font-size:100px; font-family: Arial, sans-serif; color:#fff;   text-shadow: 0 1px 0 #ccc,   0 2px 0 #c9c9c9, 0 3px 0 #bbb,   0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2),   0 20px 20px rgba(0,0,0,.15)");
  console.log(apiSourceId, requestId, fields);

  if (before_chain) {

    // before 체인 발생
    _actionResult.code = before_chain;
    _callback(_actionResult);
  }

  let use_ssl_value;
  if( use_ssl === 'false' || use_ssl === false ){
    use_ssl_value = false;
  } else if ( use_ssl === 'true' ){
    use_ssl_value = true;
  } else if( use_ssl ){
    use_ssl_value = use_ssl;
  }  else {
    use_ssl_value = null;
  }

  Orient.APIRequest.RequestAPI(this.environment, apiSourceId, requestId, transferFields, (_err, _retrievedObject, _originResponse) => {
    // http error 코드일 경우
    _callback(_err, _retrievedObject, _originResponse);
  }, enctype || this.dom().getAttribute('enctype') , requestMethodForHTTP, use_ssl_value);
});

actionStore.registerAction('sendAPISourceForm', ['apiSourceId', 'requestId', 'chainCodeCriterion', 'enctype', 'fields', 'before_chain', 'use_ssl'], function(){

  Orient.retrieveFunction('_sendAPISourceFormBody').bind(this)(apiSourceId, requestId, chainCodeCriterion, enctype, fields, before_chain, use_ssl, function(_err, _retrievedObject, _originResponse){

    if (_err) {
      _actionResult.code = 'error';
      _actionResult.data = _err;
    } else {

      if (chainCodeCriterion) {

        if (chainCodeCriterion instanceof Function) {
          _actionResult.code = chainCodeCriterion(_retrievedObject);
        } else {
          _actionResult.code = _retrievedObject[chainCodeCriterion];
        }
      } else {
        _actionResult.code = _retrievedObject['result'];
      }

      _actionResult.data = _retrievedObject;
    }
    _callback(_actionResult);
  });
});

actionStore.registerAction('api-submit', ['apiSourceId', 'requestId', 'chainCodeCriterion', 'enctype', 'fields', 'before_chain', 'use_ssl'],  function(){

  Orient.retrieveFunction('_sendAPISourceFormBody').bind(this)(apiSourceId, requestId, chainCodeCriterion, enctype, fields, before_chain, use_ssl, function(_err, _retrievedObject, _originResponse){

    if (_err) {
      _actionResult.code = 'error';
      _actionResult.data = _err;
    } else {

      if (chainCodeCriterion) {

        if (chainCodeCriterion instanceof Function) {
          _actionResult.code = chainCodeCriterion(_retrievedObject);
        } else {
          _actionResult.code = _retrievedObject[chainCodeCriterion];
        }
      } else {
        _actionResult.code = _retrievedObject['result'];
      }

      _actionResult.data = _retrievedObject;
    }
    _callback(_actionResult);
  });
});

actionStore.registerAction('focus', ['eid'], function() {
  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.getMaster().findById(eid, false);
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

actionStore.registerAction('stopImmediatePropagation', [], function() {
  _event.originEvent.stopImmediatePropagation();

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

// 배열에서 특정한 값을 제거
actionStore.registerAction('set-cookie', ['name', 'value', 'expires', 'path'], function() {
  let options = {};
  if (expires !== undefined) {
    options.expires = expires;
  }

  if (path !== undefined) {
    options.path = path;
  }

  Orient.Cookie.set(name, value, options);

  _callback(_actionResult);
});

// 배열에서 특정한 값을 제거
actionStore.registerAction('remove-cookie', ['name', 'path'], function() {
  let options = {};

  if (path !== undefined) {
    options.path = path;
  }

  Orient.Cookie.remove(name, options);

  _callback(_actionResult);
});

actionStore.registerAction('void', ['board'], function() {
  _callback(_actionResult);
});

//****** ElementNode default Actions *****//
