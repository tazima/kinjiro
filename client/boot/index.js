
/**
 * Module dependencies.
 */

var $ = require("jquery"),
    Backbone = require("backbone"),
    bind = require("functionbind"),
    AppRouter = require("app-router");

Backbone.$ = $;

exports = module.exports = function(options) {
  $(function() {
    new AppRouter({ feeds: options.feeds, reads: options.reads });
    Backbone.history.start();
  });
};
