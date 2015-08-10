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
    this.componentPool.updatePoolState('/BuilderUI/BuildingResourceStore/Meta/AvailableComponents.json');

    var component = this.componentPool.getComponentFromRemote('B');
    var React = require('react');
    React.render(React.createElement(component.class), document.body);

  };

  // 빌더를 사용하는 유저가 사용할 수 있는 Session 오브젝트의 메소드
  Session.prototype.getSessionFunctionsForUser = function() {
    var self = this;

    return {
      getComponent: function() {

        return self.componentPool.getComponentFromRemote.apply(self.componentPool, arguments)
      }
    }
  };


  module.exports = Session;
})();