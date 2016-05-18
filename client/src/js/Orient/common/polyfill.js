if (!window.console) {
  window.console = {};
  window.console.log = window.console.warn = window.console.error = window.console.groupCollapsed = window.console.groupEnd = window.console.info = function() {}
} else {
  window.console.groupCollapsed = window.console.groupCollapsed || window.console.log;
  window.console.groupEnd = window.console.groupEnd || function() {};
}