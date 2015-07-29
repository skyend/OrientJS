/**
 * UIBehavior
 * UI요소의 동작 시트
 * UIBehavior를 가진 UI요소는 UIBehavior에 입력된 동작을 하게 된다.
 *
 *
 *
 */

(function () {
    var types = ["EventEmit"];

    var UIBehavior = function () {

    };

    UIBehavior.prototype = {
        name: undefined, //
        type: undefined, // EventEmit
        desc: undefined, // EventEmit{EventName, EventData}


        setName: function (_name) {
            this.name = _name;
        },

        setType: function (_type) {
            this.type = _type;
        },

        setData: function (_data) {
            this.data = _data;
        }
    }


    module.exports = UIBehavior;
})();