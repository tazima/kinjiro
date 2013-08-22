
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone"),
    FeedItemView = require("feed-item-view");

/**
 * Expose feed list view.
 */

exports = module.exports = Backbone.View.extend({

  /**
   * @Override
   */

  initialize: function() {
    this.collection.on("add", this.renderOne, this);
  },

  /**
   * @Override
   */

  render: function() {
    this.$el.html(this.template());
    this.collection.each(this.renderOne, this);
    return this;
  },

  /**
   * Render a feed item view.
   * 
   * @param {FeedModel} model
   * @return {FeedListView}
   * @api private
   */

  renderOne: function(model) {
    this.$(".feed-list").append((new FeedItemView({ model: model })).render().el);
    return this;
  },

  /**
   * Template
   */

  template: _.template(require("./template"))

});
