/**
 * Builder,Session
 * 빌더의 Session 관리자
 *
 *
 *
 * Requires(JS) : builder.StageContext.js, builder.UI.js
 */

(function() {
  var ComponentPool = require('./builder.ComponentPool.js');
  //var ComponentSupporter = require('./builder.ComponentSupporter.js');

  var Session = function() {
    this.componentPool = new ComponentPool(this);
  };

  Session.prototype.ready = function() {
    this.componentPool.updatePoolState('/BuildingResourceStore/Meta/AvailableComponents.json');
  };

  module.exports = Session;
})();