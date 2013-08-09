
/**
 * Module dependencies.
 */

var mongoose = require("mongoose"),
    debug = require("debug")("migrate"),
    async = require("async"),
    root = require("../app"),
    User = require("../server/models/user");

exports.up = function(next) {
  User.find(function(err, users) {
    if (err) { throw err; }

    var tasks = [];

    if (!users) { return next(); }

    users.forEach(function(user) {
      tasks.push(function(cb) {
        // skip if target user dose not have `subscribe` field
        if (!user.get('_subscribes')) { return cb(null); }

        debug("migrate " + user.name + "'s subscribes");

        var subscribes = user.get('_subscribes').map(function(subscribe) {
          return { _feed: subscribe, unread_count: 0 };
        });

        // to delete filed that current User dose not have,
        // call native collection's update.
        User.collection.update({ _id: user._id }, {
          $set: { subscribes: subscribes },
          $unset: { _subscribes: 1 }
        }, cb);
      });
    });

    async.series(tasks, next);
  });
};

exports.down = function(next) {
  User.find(function(err, users) {
    if (err) { throw err; }

    var tasks = [];

    if (!users) { return next(); }

    users.forEach(function(user) {
      tasks.push(function(cb) {
        if (!user.get('subscribes')) { return cb(null); }
        
        var _subscribes = user.get('subscribes').map(function(subscribe) {
          return subscribe._feed;
        });

        User.collection.update({ _id: user._id }, {
          $set: { _subscribes: _subscribes },
          $unset: { subscribes: 1 }
        }, cb);
      });
    });

    async.series(tasks, next);
  });
};
