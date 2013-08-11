
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

  events: {
    "click .next": "next"
  },

  next: function() {
    this.collection.fetch({ data: { page: this.page } });
    this.page += 1;
  },

  /**
   * @Override
   */

  initialize: function(opts) {
    this.reads = opts.reads;
    this.page = 1;
    this.collection.on("reset", this.render, this);
    this.collection.on("add", this.renderOne, this);
    this.collection.fetch({ reset: true, data: { page: this.page } });
    this.page += 1;
  },

  /**
   * @Override
   */

  render: function() {
    this.$el.html(this.template());
    this.collection.each(this.renderOne, this);
    // trigger `read` evnet on first child.
    this.triggerRead(this.$('.post-item:first-child'));
    return this;
  },

  /**
   * Render `post-item-view`.
   *
   * @param {Backbone.Model} model
   */

  renderOne: function(model) {
    var itemView = new PostItemView({ model: model, reads: this.reads }).render();
    this.$(".post-list").append(itemView.el);
    this.bindScrollPosition(itemView.el);
  },

  /**
   * Bind scrolle event.
   */

  bindScrollPosition: function(el) {
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

