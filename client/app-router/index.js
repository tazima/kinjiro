
/**
 * Module dependencies.
 */

var Backbone = require("backbone"),
    AppView = require("app-view"),
    PostListView = require("post-list-view"),
    PostCollection = require("post-collection");

exports = module.exports = Backbone.Router.extend({

  routes: {
    "feeds/:fid/posts": "posts"
  },

  initialize: function(options) {
    this.feeds = options.feeds;
    (new AppView({
      el: "#content",
      collection: this.feeds
    })).render();
  },

  posts: function(fid) {
    (new PostListView({
      el: ".post-list",
      collection: new PostCollection([], { fid: fid })
    })).render();
  }

});
