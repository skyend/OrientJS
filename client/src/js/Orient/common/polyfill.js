if (!window.console) {

  window.console = {};
  window.console.log = window.console.warn = window.console.error = window.console.groupCollapsed = window.console.groupEnd = window.console.info = function() {}
} else {

  window.console.log = window.console.log || function() {};
  window.console.groupCollapsed = window.console.groupCollapsed || window.console.log;
  window.console.groupEnd = window.console.groupEnd || function() {};



}


if (window.console && typeof(window.console.time) == "undefined") {
  console.time = function(name, reset) {
    if (!name) {
      return;
    }
    var time = new Date().getTime();
    if (!console.timeCounters) {
      console.timeCounters = {};
    }
    var key = "KEY" + name.toString();
    if (!reset && console.timeCounters[key]) {
      return;
    }
    console.timeCounters[key] = time;
  };

  console.timeEnd = function(name) {
    var time = new Date().getTime();
    if (!console.timeCounters) {
      return;
    }
    var key = "KEY" + name.toString();
    var timeCounter = console.timeCounters[key];
    var diff;
    if (timeCounter) {
      diff = time - timeCounter;
      var label = name + ": " + diff + "ms";
      console.info(label);
      delete console.timeCounters[key];
    }
    return diff;
  };
}


if (Function.prototype.bind && window.console && typeof console.log == "object") {
  [
    "log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"
  ].forEach(function(method) {
    console[method] = this.bind(console[method], console);
  }, Function.prototype.call);
}