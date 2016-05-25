const CHARS64 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890+="; // 64자
const CHARS32 = "ABCDEFGHIJKLMNOPQRSTUVWYZ12345+="; // 32자


var Identifier = {
  genUUID: function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },

  numberTo64Hash: function(_number) {
    let bin = _number.toString(2);

    let builtString = "";
    let chunkCount = Math.ceil(bin.length / 6); // 6비트는 0~63의 수를 표현

    let start;
    for (let i = 0; i < chunkCount; i++) {
      start = i * 6;

      builtString += CHARS64[parseInt(bin.slice(start, start + 6), 2)];
    }

    return builtString;
  },

  numberTo32Hash: function(_number) {
    let bin = _number.toString(2);

    let builtString = "";
    let chunkCount = Math.ceil(bin.length / 5); // 6비트는 0~31의 수를 표현

    let start;
    for (let i = 0; i < chunkCount; i++) {
      start = i * 5;

      builtString += CHARS32[parseInt(bin.slice(start, start + 5), 2)];
    }

    return builtString;
  },

  chars64SequenceStore: function(_maxRewind) {
    let seq = 0;

    return function() {
      if (_maxRewind) {
        if (seq > _maxRewind) {
          seq = 0;
        }
      }

      return Identifier.numberTo64Hash(seq++);
    };
  },

  chars32SequenceStore: function(_maxRewind) {
    let seq = 0;

    return function() {
      if (_maxRewind) {
        if (seq > _maxRewind) {
          seq = 0;
        }
      }

      return Identifier.numberTo32Hash(seq++);
    };
  }
};


export default Identifier;