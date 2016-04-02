import User from './Librarian/User.js';

class Librarian {
  constructor(_agent) {
    this.agent = _agent;
  }

  registerUser(_su, _data, _callback) {
    console.log('User Create');
  }
}

export default Librarian;