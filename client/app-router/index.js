
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
    this.subscribes = options.subscribes;
  },

  index: function() {
    (new AppView({ el: "#content", collection: this.subscribes })).render();
  }

});
