
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    sanitise = require('../server/libs/sanitise'),
    root = require("../app"),
    Post = require('../server/models/post');

exports.up = function(next){
  Post.find(function(err, posts) {
    if (err) { return next(err); }
    async.each(posts, function(post, cb) {
      post.description = sanitise(post.description);
      post.save(cb);
    }, next);
  });
};

exports.down = function(next){
  next();
};
