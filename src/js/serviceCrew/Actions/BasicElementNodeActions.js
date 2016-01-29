import ActionStore from './ActionStore';

let actionStore = ActionStore.instance();

actionStore.registerAction('update', [], function() {
  console.log('hello update');
});

console.log(actionStore);