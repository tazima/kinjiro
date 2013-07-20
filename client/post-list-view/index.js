
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone"),
    PostItemView = require("post-item-view");

exports = module.exports = Backbone.View.extend({

  initialize: function() {
    this.collection.on("reset", this.render, this);
    this.collection.fetch({ reset: true });
  },

  render: function() {
    this.$el.html(this.template());
    this.collection.each(this.renderOne, this);
    return this;
  },

  renderOne: function(model) {
    this.$(".post-list").append(
      new PostItemView({ model: model }).render().el
    );
  },

  template: _.template(require("./template"))

});

