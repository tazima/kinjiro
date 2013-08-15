
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    root = require("../app"),
    Feed = require('../server/models/feed'),
    Post = require('../server/models/post');

exports.up = function(next) {
  Post.find(function(err, posts) {
    if (err) { return next(err); }
    async.each(posts, function(post, cb) {
      if (post.pubdate instanceof Date) { return cb(null); }
      post.pubdate = new Date(post.pubdate);
      post.save(cb);
    }, next);
  });
};

exports.down = function(next) {
  Post.find(function(err, posts) {
    if (err) { return next(err); }
    async.each(posts, function(post, cb) {
      if (typeof post.pubdate === 'string') { return cb(null); }
      post.pubdate = post.pubdate.toString();
      post.save(cb);
    }, next);
  });
};
