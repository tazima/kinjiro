
/**
 * Module dependencies.
 */

var nodeio = require('node.io'),
    mongoose = require('mongoose'),
    debug = require('debug')('job'),
    async = require('async'),
    root = require('../../../app'),
    User = require('../../models/user'),
    Post = require('../../models/post');

/**
 * Update unread count of subscribes of users.
 */

mongoose.createConnection(root.get('db connection string'), function(err) {
  if (err) { throw err; }
  debug('Connected to mongo db');
});

exports.job = new nodeio.Job({

  /**
   * @Override
   */

  init: function() {
    this.isFirst = true;
  },

  /**
   * @Override
   */

  input: function(start, num, callback) {
    if (!this.isFirst) { return callback(false); }

    this.isFirst = false;

    User.find(function(err, users) {
      if (err) { this.fail(err); }
      callback(users);
    });
  },

  /**
   * @Override
   */

  run: function(user) {
    var job = this,
        tasks = [],
        updatedSubscribes = [];

    user.subscribes.forEach(function(subscribe) {
      tasks.push(function(cb) {
        Post.find({ _feed: subscribe._feed })
          .nin('_id', user._read_posts)
          .count(function(err, unreadCount) {
            if (err) { job.fail(err); }
            subscribe.unread_count = unreadCount;
            updatedSubscribes.push(subscribe);
            cb(null);
          });
      });
    });

    tasks.push(function(cb) {
      user.subscribes = updatedSubscribes;
      user.save(cb);
    });

    async.series(tasks, job.emit.bind(job, user));
  }

});

