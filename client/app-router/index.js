
/**
 * Module dependencies.
 */

var Backbone = require("backbone"),
    AppView = require("app-view");

exports = module.exports = Backbone.Router.extend({

  routes: {
    "": "index"
  },

  initialize: function(options) {
    this.feeds = options.feeds;
  },

  index: function() {
    (new AppView({ el: "#content", collection: this.feeds })).render();
  }

});
