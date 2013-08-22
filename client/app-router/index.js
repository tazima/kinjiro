
/**
 * Module dependencies.
 */

var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    AppView = require('app-view'),
    PostListView = require('post-list-view'),
    PostCollection = require('post-collection'),
    ReadCollection = require('read-collection');

/**
 * Expose application router.
 */

exports = module.exports = Backbone.Router.extend({

  routes: {
    '': 'top',
    'feeds/:fid/posts': 'posts'
  },

  /**
   * @Override
   */

  initialize: function(options) {
    this.feeds = options.feeds;
    this.reads = new ReadCollection();
    this.delegateReadCreationToFeeds();
    this.appView = new AppView({
      el: '#content',
      collection: this.feeds
    }).render();
  },

  /**
   * top route
   * 
   * @api public
   */

  top: function() {
    this.toggleResponsiveClasses();
  },

  /**
   * route feeds/:fid/posts
   *
   * @param {String} fid
   */

  posts: function(fid) {
    this.toggleResponsiveClasses();
    this.toggleActiveFeedItem(fid);
    if (this.postListView) { this.postListView.clear(); }
    this.postListView = new PostListView({
      el: '.posts',
      collection: new PostCollection([], { fid: fid }),
      feed: this.feeds.get(fid),
      reads: this.reads
    }).render();
  },

  /**
   * Register listener for add event of reads to
   * modify read feed's unread_count.
   *
   * @api private
   */

  delegateReadCreationToFeeds: function() {
    this.reads.on('add', _.bind(function(read) {
      var feed = this.feeds.get(read.get('_feed'));
      feed.set('unread_count', feed.get('unread_count') - 1);
    }, this));
  },

  /**
   * Toggle Bootstrap's responsive classes.
   * 
   * @api private
   */

  toggleResponsiveClasses: function() {
    this.appView.$el.find('.feeds,.posts,.back').toggleClass('hidden-xs');
  },

  /**
   * Toggle active feed item based on `fid`.
   *
   * @param {String} fid
   * @api private
   */
  toggleActiveFeedItem: function(fid) {
    this.appView.$('.feed-list .feed-item').removeClass('active');
    this.appView.$('.feed-list')
      .find('[href*=\'' + encodeURIComponent(fid) + '\']')
      .addClass('active');
  }

});
