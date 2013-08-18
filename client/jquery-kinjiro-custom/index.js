
/**
 * Module dependencies.
 */

var $ = require("jquery");

/**
 * Add `className` momentary.
 * 
 * @param {String} className
 * @return {jQuery.Object}
 * @api public
 */

$.fn.momentaryClass = function(className) {
  return this.each(function() {
    var $this = $(this);
    $this.addClass(className);
    setTimeout(function() {
      $this.removeClass(className);
    }, $.fn.momentaryClass.defaults.duration);
  });
};

/**
 * Default settings.
 */

$.fn.momentaryClass.defaults = {
  duration: 1000
};

