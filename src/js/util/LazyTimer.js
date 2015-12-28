/**
    Lazy Timer

     **/

class LazyTimer {
  constructor() {
    this._lazy_callbacks = {};
    this._lazy_intervals = {};
  }

  set(code, ms, cb) {

    var self = this;
    ms = ms / 2;
    var lazyitv = self._lazy_intervals[code];

    if (lazyitv) {
      lazyitv.water = 1;
    } else {

      var interval_id = setInterval(function(lazycode) {
        var lazier = self._lazy_intervals[lazycode];

        if (lazier.water == 1) {
          lazier.water = 0;
        } else if (lazier.water == 0) {
          lazier.fire(); // callback func call

          self._delete_lazier(lazycode);
        }

      }, ms, code);

      lazyitv = self._lazy_intervals[code] = {
        itvid: interval_id,
        interval: ms,
        fire: cb,
        water: 0
      };
    }
  }

  _delete_lazier(code) {
    var self = this;

    var lazyitv = self._lazy_intervals[code];

    if (lazyitv) {
      clearInterval(lazyitv.itvid);
      delete self._lazy_intervals[code];
      return true;
    }
  }
}


export default LazyTimer;