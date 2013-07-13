
/**
 * Module dependencies.
 */

var Backbone = require("backbone"),
    SubscribeListView = require("subscribe-list-view");

exports = module.exports = Backbone.Router.extend({

  routes: {
    "": "index"
  },

  index: function() {
    (new SubscribeListView({ el: ".subscrive-list" }))
      .render();
  }

});
