
/**
 * Module dependencies.
 */

var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    ScrollPosition = require('scroll-position'),
    PostItemView = require('post-item-view');

/**
 * Post list view.
 */

exports = module.exports = Backbone.View.extend({

  /**
   * Max count on fetching posts.
   */

  MAX_COUNT: 10,

  events: {
    'click .next': 'next'
  },

  /**
   * Default values for `ScrollPosition`
   */

  scrollPositionDefault: {
    offsetOut: 100,
    offsetIn: 0
  },

  /**
   * @Override
   */

  initialize: function(opts) {
    this.feed = opts.feed;
    this.reads = opts.reads;
    this.page = 1;
    this.listenTo(this.collection, 'reset', this.render);
    this.listenTo(this.collection, 'add', this.renderOne);
    this.listenTo(this.collection, 'sync', this.bindInfiniteScrollPosition);
    this.collection.fetch({ reset: true, data: { page: this.page } });
    this.page += 1;
  },

  /**
   * @Override
   */

  render: function() {
    this.$el.html(this.template(this.feed.toJSON()));
    this.collection.each(this.renderOne, this);
    this.$el.animate({ scrollTop: 0 });
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
    this.$('.post-list').append(itemView.el);
    this.bindScrollPosition(itemView.$el.get());
  },

  /**
   * Bind scrolle event.
   *
   * @param {Element} el
   */

  bindScrollPosition: function(el) {
    var itemPosition = new ScrollPosition(el, this.scrollPositionDefault);
    itemPosition.on('scrollInOut', _.bind(this.triggerRead, this));
  },

  /**
   * Bind infinite scrolle event.
   *
   * @param {Backbone.Collection} collection
   */

  bindInfiniteScrollPosition: function(collection) {
    if (this.infiniteScrollPosition) {
      // remove previously registered listeners
      this.unbindInfiniteScrollPosition();
    }

    // there are no more posts on server so return without register listener.
    if (collection.length < this.MAX_COUNT) { return; }

    this.infiniteScrollPosition = new ScrollPosition(
      this.$('.post-item').eq(-3).get(), this.scrollPositionDefault);
    this.infiniteScrollPosition.on('scrollInOut', _.bind(this.next, this));
  },

  /**
   * Unbind infinite scroll event on `this.infiniteScrollPosition`.
   */

  unbindInfiniteScrollPosition: function() {
    this.infiniteScrollPosition.off();
    this.infiniteScrollPosition = void 0;
  },

  /**
   * Fetch next page posts.
   */

  next: function() {
    this.collection.fetch({ data: { page: this.page } });
    this.page += 1;
  },

  /**
   * Stop listening on `this` events and unbind infinite scrolle event.
   */

  clear: function() {
    this.stopListening();
    if (this.infiniteScrollPosition) { this.unbindInfiniteScrollPosition(); }
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

  template: _.template(require('./template'))

});

