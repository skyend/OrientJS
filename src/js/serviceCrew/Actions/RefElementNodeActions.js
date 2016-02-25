import ActionStore from './ActionStore';

let actionStore = ActionStore.instance();


actionStore.registerAction('resetRefInstance', [], function() {
  this.resetRefInstance();

  _callback(_actionResult);
});