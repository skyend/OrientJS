import ActionStore from './ActionStore';
import ICEAPISource from '../ICEAPISource';
import APIFarmSource from '../APIFarmSource';
import SA_Loader from '../StandAloneLib/Loader';

window.ICEAPISource = ICEAPISource;
window.SA_Loader = SA_Loader;
window.APIFarmSource = APIFarmSource;

let actionStore = ActionStore.instance();

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

  this.refresh(function() {
    _actionResult.code = 'success';
    _callback(_actionResult);
  });
});

actionStore.registerAction('refresh-to', ['eid', 'selector', 'taskChain'], function() {
  _actionResult.taskChain = taskChain;

  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.environment.findById(eid, true);
  }

  targetElementNode.refresh(function() {
    _actionResult.code = 'success';
    _callback(_actionResult);
  });
});


actionStore.registerAction('update', ['taskChain'], function() {
  _actionResult.taskChain = taskChain;

  this.update(function() {
    _actionResult.code = 'success';
    _callback(_actionResult);
  });
});

actionStore.registerAction('update-to', ['eid', 'taskChain'], function() {
  _actionResult.taskChain = taskChain;

  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.environment.findById(eid, true);
  }

  targetElementNode.update(function() {
    _actionResult.code = 'success';
    _callback(_actionResult);
  });
});

actionStore.registerAction('attr', ['name', 'value', 'taskChain'], function() {
  this.setAttribute(name, value);

  _actionResult.taskChain = taskChain;
  _actionResult.code = 'success';
  _callback(_actionResult);
});

actionStore.registerAction('attr-to', ['eid', 'selector', 'name', 'value', 'taskChain'], function() {
  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.environment.findById(eid, true);
  }

  targetElementNode.setAttribute(name, value);

  _actionResult.code = 'success';
  _actionResult.taskChain = taskChain;
  _callback(_actionResult);
});

actionStore.registerAction('exists-toggle-attr-to', ['eid', 'name', 'taskChain'], function() {
  let targetElementNode;
  if (eid !== undefined) {
    targetElementNode = this.environment.findById(eid, true);
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

actionStore.registerAction('if', ['conditionResult'], function() {

  if (conditionResult) {
    _actionResult.code = 'true';
  } else {
    _actionResult.code = 'false';
  }

  _callback(_actionResult);
});


actionStore.registerAction('sendAPISourceForm', ['apiSourceId', 'requestId'], function(){
  let that = this;
  let type = 'ice-api';
  if( /^farm\//.test(apiSourceId) ){
    type = 'farm-api';
  }

  window['SA_Loader'].loadAPISource(apiSourceId, function(_apiSourceData) {
    let apiSource;
    let fields = {};
    //let request;
    if( type === 'farm-api' ){
      apiSource = new (window.APIFarmSource)(_apiSourceData);
      apiSource.setHost($ervice.page.apiFarmHost);
    } else if( type === 'ice-api'){
      apiSource = new (window.ICEAPISource)(_apiSourceData);
      apiSource.setHost($ervice.page.iceHost);
    }

    //request = apiSource.findRequest(requestId);

    that.findChildren('[transfer-value]').map(function(_elementNode){
      fields[_elementNode.getAttributeWithResolve('name')] = _elementNode.getAttributeWithResolve('transfer-value');
    });


    apiSource.executeRequest(requestId, fields, {}, that.getAttribute('enctype'), function(_result, _statusCode) {

      _actionResult.code = _result.result || _statusCode;
      _actionResult.data = _result;
      _callback(_actionResult);
    });

    console.log(apiSource, that, fields);
  });
});

//****** ElementNode default Actions *****//

/*
  RequestAPI
*/
var action_sendForm = function(_complete, _apiSourceId, _requestId) {

  let that = this;
  SA_Loader.loadAPISource(_apiSourceId, function(_apiSourceData) {
    let fieldObject = {};
    let apiSource = new ICEAPISource(_apiSourceData);
    let request = apiSource.findRequest(_requestId);
    apiSource.setHost(Gelato.one().page.iceHost);

    let reqFields = request.fields;

    reqFields.map(function(_field) {
      if (that.forwardDOM[_field.key] !== undefined) {
        fieldObject[_field.key] = that.getFormFieldDOMData(that.forwardDOM[_field.key]);
      }
    });

    console.log(fieldObject);

    apiSource.executeRequest(_requestId, fieldObject, {}, that.getAttribute('enctype'), function(_result) {
      console.log(_result);
    });

    console.log(apiSource);
  });

}

console.log(actionStore);
