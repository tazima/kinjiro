
/**
 * Module dependencies.
 */

var Backbone = require("backbone"),
    SubscribeListView = require("subscribe-list-view");

exports = module.exports = Backbone.Router.extend({

  routes: {
    "": "index"
  },

  initialize: function(options) {
    this.subscribes = options.subscribes;
  },

  index: function() {
    (new SubscribeListView({
      el: ".subscrive-list",
      collection: this.subscribes
    })).render();
  }

});
