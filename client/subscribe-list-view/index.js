
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone"),
    SubscribeItemView = require("subscribe-item-view");

exports = module.exports = Backbone.View.extend({

  render: function() {
    this.$el.html(this.template());
    this.collection.each(this.renderOne, this);
    return this;
  },

  renderOne: function(model) {
    this.$(".subscribe-list").append(
      (new SubscribeItemView({ model: model }))
        .render().el);
    return this;
  },

  template: _.template(require("./template"))

});
