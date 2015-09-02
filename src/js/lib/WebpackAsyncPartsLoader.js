/**
 * AsyncPartsLoader
 **/


(function () {
    module.exports = {
        get: function (_srcPath, _callback) {
            try {
                console.log("bundle!" + _srcPath);
                var bundle = require("bundle!" + _srcPath);
            } catch (e) {
                return _callback(e);
            }

            bundle(function (_source) {
                _callback(null, _source);
            })
        }
    };
})();