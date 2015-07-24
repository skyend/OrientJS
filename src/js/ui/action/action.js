/**
 * Action
 * 사용자의 동작과 명령을 전달하는 객체
 * 주로 이벤트에 적재되어 액션처리자에게 전달된다.
 *
 *
 *
 * Requires(JS) : builder.StageContext.js, builder.UI.js
 */

(function() {
   var Action = function() {

   };

   Action.prototype = {
      name: undefined,
      type: undefined,
      data: undefined,

      setName: function(_name) {
         this.name = _name;
      },

      setType: function(_type) {
         this.type = _type;
      },

      setData: function(_data) {
         this.data = _data;
      }
   }


   module.exports = Action;
})();