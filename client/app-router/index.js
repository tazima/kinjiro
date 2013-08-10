
/**
 * Module dependencies.
 */

var _ = require('underscore'),
    Backbone = require('backbone'),
    AppView = require('app-view'),
    PostListView = require('post-list-view'),
    PostCollection = require('post-collection');

exports = module.exports = Backbone.Router.extend({

  routes: {
    'feeds/:fid/posts': 'posts'
  },

  initialize: function(options) {
    this.feeds = options.feeds;
    this.reads = options.reads;
    this.delegateReadCreationToFeeds();
    (new AppView({
      el: '#content',
      collection: this.feeds
    })).render();
  },

  posts: function(fid) {
    (new PostListView({
      el: '.posts',
      collection: new PostCollection([], { fid: fid }),
      reads: this.reads
    })).render();
  },

  delegateReadCreationToFeeds: function() {
    this.reads.on('add', _.bind(function(read) {
      var feed = this.feeds.findWhere({ _id: read.get('_feed') });
      feed.set('unread_count', feed.get('unread_count') - 1);
    }, this));
  }

});
