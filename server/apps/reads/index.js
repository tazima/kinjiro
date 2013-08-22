
/**
 * Module dependencies.
 */

var express = require('express'),
    async = require('async'),
    User = require('../../models/user');

var app = module.exports = express();

// config

app.use(express.bodyParser());
app.use(express.errorHandler());

/**
 * POST /reads
 */

app.post('/reads', loadUser, function(req, res) {
  updateUser(req.user, req.body._id, req.body._feed, function(err) {
    if (err) { throw err; }
    res.send(200);
  });
});

/**
 * Update user's unread_count and subscribes.
 *
 * @param {User} user
 * @param {String} postId
 * @param {String} feedId
 * @param {Function} cb
 * @api private
 */

function updateUser(user, postId, feedId, cb) {
  user._read_posts.push(postId);

  async.map(user.subscribes, function(subscribe, cb) {
    if (subscribe._feed === feedId) { subscribe.unread_count -= 1; }
    cb(null, subscribe);
  }, function(err, newSubscribes) {
    if (err) { throw err; }
    user.subscribes = newSubscribes;
    user.save(cb);
  });
}

/**
 * Load user and populate it to `req`.
 */

function loadUser(req, res, next) {
  User.findOne({ _id: req.session.user_id }, function(err, user) {
    if (err) { throw err; }
    req.user = user;
    next();
  });
}

