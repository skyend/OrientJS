import ActionStore from './ActionStore';

let actionStore = ActionStore.instance();


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

console.log(actionStore);