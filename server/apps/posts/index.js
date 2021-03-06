
/**
 * Module dependencies.
 */

var express = require("express"),
    debug = require("debug")("http"),
    User = require("../../models/user"),
    Feed = require("../../models/feed"),
    request = require("request"),
    FeedParser = require("feedparser");

var app = module.exports = express();

var MAX_COUNT = 10;

// config

app.use(express.bodyParser());
app.use(express.errorHandler());

/**
 * GET /feeds/:fid/posts
 */

app.get("/feeds/:fid/posts", loadUser, loadFeed, function(req, res) {
  if (!req.feed) { return res.send(404); }
  res.send(req.feed._feed_posts);
});

/**
 * Middleware to load user.
 */

function loadUser(req, res, next) {
  if (!req.session.user_id) { return next(); }

  User.findOne({ _id: req.session.user_id }, function(err, user) {
    req.user = user;
    next(err);
  });
}

/**
 * Middleware to load feed.
 * If user is exists, mark `unread` true for unread posts.
 */

function loadFeed(req, res, next) {
  Feed.findOne({ _id: req.params.fid })
    .lean()
    .populate({
      path: '_feed_posts',
      options: { sort: { 'pubdate': -1 } }
    })
    .where('_feed_posts')
    .slice([((req.query.page || 1) - 1) * MAX_COUNT, MAX_COUNT])
    .exec(function(err, feed) {
      if (!feed) { return next(); }
      if (req.user) { feed._feed_posts = postsMarkedRead(req.user, feed._feed_posts); }
      req.feed = feed;
      next();
    });
}

/**
 * Return the posts marked.
 *
 * @param {User} user
 * @param {[Post]} posts
 * @return {[Post]}
 * @api private
 */

function postsMarkedRead(user, posts) {
  var read = user._read_posts;

  return posts.map(function(post) {
    post.unread = !~read.indexOf(post._id);
    return post;
  });
}

app.setMaxCount = function(maxCount) {
  MAX_COUNT = maxCount;
  return this;
};
