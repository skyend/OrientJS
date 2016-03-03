import FunctionStore from './FunctionStore';
let functionStore = FunctionStore.instance();

functionStore.registerFunction('test', function(a) {

  alert(a);
});