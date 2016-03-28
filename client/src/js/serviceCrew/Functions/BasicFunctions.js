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