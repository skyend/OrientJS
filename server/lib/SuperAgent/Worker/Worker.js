import events from 'events';

class Worker extends events.EventEmitter {
  constructor(_agent) {
    super();

    this.agent = _agent;

  }

  start() {

  }

  finish() {

  }
}

export default Worker;