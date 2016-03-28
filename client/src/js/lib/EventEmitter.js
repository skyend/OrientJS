var EventEmitter = function() {
  this.__eventRegistry__ = {};
};

EventEmitter.prototype.on = function(_eventName, _eventCallbackFunc) {
  // EventPool존재 확인
  if (typeof this.__eventRegistry__ !== 'object') {
    throw new Error('error: This object must have eventRegistry property.');
  }

  if (typeof this.__eventRegistry__[_eventName] === 'undefined') {
    this.__eventRegistry__[_eventName] = [];
  }
  this.__eventRegistry__[_eventName].push(_eventCallbackFunc);
};

EventEmitter.prototype.emit = function(_eventName, _eventData) {
  // EventPool존재 확인
  if (typeof this.__eventRegistry__ !== 'object') {
    throw new Error('error: This object must have eventRegistry property.');
  }

  if (typeof this.__eventRegistry__[_eventName] !== 'undefined') {
    for (var i = 0; i < this.__eventRegistry__[_eventName].length; i++) {
      this.__eventRegistry__[_eventName][i](_eventData);
    }
  }
};

module.exports = EventEmitter;