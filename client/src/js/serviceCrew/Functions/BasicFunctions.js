import FunctionStore from './FunctionStore';
let functionStore = FunctionStore.instance();

functionStore.registerFunction('test', function(a) {

  alert(a);
});


/*
  Filter : validly
    입력된 배열의 요소중 참으로 판단되는 요소만 추려 배열로 구성하여 반환한다.

  Parameters:
    array - 필터링 대상 Array

  return
    filtered Array

*/
functionStore.registerFunction('filter-validly', function(array) {
  let newArray = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i])
      newArray.push(array[i]);
  }

  return newArray;
});

functionStore.registerFunction('extract-form-params', function(_targetElementNode){
  let that = _targetElementNode || this;
  let formDOM = that.dom();

  let transferFields = {};
  // name Attribute 를 가진 TagElement 를 검색한다.
  let foundElements = formDOM.querySelectorAll('[name]') || [];
  let foundElementNodes = [];
  let foundElement;
  let foundElementNode;

  // name Attribute를 가진 TagElement중 transfer-value 필드를 가진 ElementNode를 검색한다.
  for (let i = 0; i < foundElements.length; i++) {
    foundElement = foundElements[i];
    foundElementNode = Orient.getNodeByDOM(foundElement);

    if (foundElementNode !== null && foundElementNode.hasAttribute('transfer-value')) {
      foundElementNodes.push(foundElementNode);
    }
  }

  let name, value;
  foundElementNodes.map(function(_elementNode) {

    let pass = true;

    _elementNode.climbParents(function(_parent) {
      if (_parent === that) {

        return null;
      } else if (_parent.hasAttribute('ignore-transfer')) {

        pass = false;
        return null;
      }
    });

    if (pass) {
      name = _elementNode.getAttributeWithResolve('name');
      value = _elementNode.getAttributeWithResolve('transfer-value');

      if (name && value) {
        transferFields[name] = value;
      }
    }
  });
  console.log('TF>>',transferFields);
  return transferFields;
});
