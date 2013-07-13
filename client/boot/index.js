
/**
 * Module dependencies.
 */

var $ = require("jquery"),
    Backbone = require("backbone"),
    AppRouter = require("app-router");

Backbone.$ = $;

$(function() {
  new AppRouter;
  Backbone.history.start();
});
