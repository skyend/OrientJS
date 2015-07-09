/**
 * Builder,VirtualDom
 * 가상 Dom Object
 *
 * 자식을 가지는 Dom Object 의 가상 Object
 * Dom Object 와 vid 를 이용하여 동기화를 한다.
 *
 * Requires(JS) : builder.VirtualDom.js
 */

(function(){
    var VirtualDom = function( _targetElement ){
        console.log(_targetElement);
    };

    module.exports = VirtualDom;
})();