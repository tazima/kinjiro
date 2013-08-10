
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    $ = require("jquery"),
    Backbone = require("backbone"),
    ScrollPosition = require('scroll-position'),
    PostItemView = require("post-item-view");

/**
 * Post list view.
 */

exports = module.exports = Backbone.View.extend({

  /**
   * @Override
   */

  initialize: function(opts) {
    this.reads = opts.reads;
    this.collection.on("reset", this.render, this);
    this.collection.fetch({ reset: true });
  },

  /**
   * @Override
   */

  render: function() {
    this.$el.html(this.template());
    this.collection.each(this.renderOne, this);
    this.bindScrollPosition();
    return this;
  },

  /**
   * Render `post-item-view`.
   *
   * @param {Backbone.Model} model
   */

  renderOne: function(model) {
    this.$(".post-list").append(
      new PostItemView({ model: model, reads: this.reads }).render().el
    );
  },

  /**
   * Bind scrolle event.
   */

  bindScrollPosition: function() {
    var itemPosition = new ScrollPosition(this.$('.post-item').get(), {
      offsetOut: 100,
      offsetIn: 0
    });
    itemPosition.on('scrollInOut', _.bind(this.triggerRead, this));
  },

  /**
   * Make the model that e's view has read.
   *
   * @param {Event} e
   */

  triggerRead: function(item) {
    $(item).trigger('post.read');
  },

  /**
   * Template function
   */

  template: _.template(require("./template"))

});

