"use strict";
/**
 * Async.js
 * 비동기 메소드를 동기로 사용할 수 있도록 도와준다.
 */

(function() {
  module.exports = {

    /**
     * waterFall for Async
     * @param ... FirstCallBack Arguments
     * @param Function Array[func,...]
     *
     * common.waterFall('A' ,[function(_a,_cb){
       console.log(1, _a);
       _cb(_a);
     }, function(_b,_cb){
       console.log(2,_b);
       _cb(_b);
     }, function(_c, _cb){
       console.log(3, _c);
     }]);
     */
    waterFall: function() {
      var funcCursor = 0;
      var funcsArray = arguments[arguments.length - 1];
      var firstFunc = funcsArray[0];

      var firstCallArguments = [];
      for (var i = 0; i < arguments.length - 1; i++) {
        firstCallArguments.push(arguments[i]);
      }


      function next() {
        var nextFunction = funcsArray[++funcCursor];
        var callArguments = [];
        for (var i = 0; i < arguments.length; i++) {
          callArguments.push(arguments[i]);
        }

        callArguments.push(next);
        nextFunction.apply(this, callArguments);
      }

      firstCallArguments.push(next);
      firstFunc.apply(this, firstCallArguments);
    }
  };
})();