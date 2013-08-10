
/**
 * Module dependencies.
 */

var _ = require('underscore'),
    Backbone = require('backbone'),
    AppView = require('app-view'),
    PostListView = require('post-list-view'),
    PostCollection = require('post-collection'),
    ReadCollection = require('read-collection');

exports = module.exports = Backbone.Router.extend({

  routes: {
    'feeds/:fid/posts': 'posts'
  },

  /**
   * @Override
   */

  initialize: function(options) {
    this.feeds = options.feeds;
    this.reads = new ReadCollection();
    this.delegateReadCreationToFeeds();
    (new AppView({
      el: '#content',
      collection: this.feeds
    })).render();
  },

  /**
   * route feeds/:fid/posts
   *
   * @param {String} fid
   */

  posts: function(fid) {
    (new PostListView({
      el: '.posts',
      collection: new PostCollection([], { fid: fid }),
      reads: this.reads
    })).render();
  },

  /**
   * Register listener for add event of reads to
   * modify read feed's unread_count
   *
   * @api private
   */

  delegateReadCreationToFeeds: function() {
    this.reads.on('add', _.bind(function(read) {
      var feed = this.feeds.findWhere({ _id: read.get('_feed') });
      feed.set('unread_count', feed.get('unread_count') - 1);
    }, this));
  }

});
