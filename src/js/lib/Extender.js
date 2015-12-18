/**
 * Builder,Utils
 * 빌더 Uitls
 *
 *
 *
 *
 */


exports.extends = function(_source, _target, _arguments) {
  var F = function() {
    return _source.apply(this, _arguments);
  }

  F.prototype = _source.prototype;

  var inst = new F();

  for (attr in inst) {
    _target[attr] = inst[attr];
  }
}