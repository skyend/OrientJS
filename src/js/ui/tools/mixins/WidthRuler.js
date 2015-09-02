/**
 * WidthRuler.js
 *
 *
 *
 */

(function() {

  var WidthRuler = {
    getMySizeClass: function() {
      if (typeof this.props.width === 'undefiend') throw new Error('Not declared width property.');

      if (this.props.width <= 768) {
        return 'narrow-width';
      } else {
        return 'wide-width';
      }
    }
  };

  module.exports = WidthRuler;

})();