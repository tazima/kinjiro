
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    root = require("../app"),
    Feed = require('../server/models/feed'),
    Post = require('../server/models/post');

exports.up = function(next) {
  var tasks = [];

  Feed.find(function(err, feeds) {
    if (err) { throw err; }

    feeds.forEach(function(feed) {
      tasks.push(function(cb) {
        Post.find({ _feed: feed._id }, function(err, posts) {
          if (err) { throw err; }
          feed._feed_posts = posts.map(function(post) { return post._id; });
          feed.save(cb);
        });
      });
    });

    async.series(tasks, next);
  });
};

exports.down = function(next) {
  next();
};
