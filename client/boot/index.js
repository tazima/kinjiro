
/**
 * Module dependencies.
 */

var $ = require("jquery"),
    Backbone = require("backbone"),
    AppRouter = require("app-router");

Backbone.$ = $;

exports = module.exports = function(options) {
  $(function() {
    new AppRouter({ feeds: options.feeds });
    Backbone.history.start();
  });
};
