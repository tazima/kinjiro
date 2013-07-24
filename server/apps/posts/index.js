
/**
 * Module dependencies.
 */

var express = require("express"),
    Feed = require("../../models/feed"),
    request = require("request"),
    FeedParser = require("feedparser");

var app = module.exports = express();

// config

app.use(express.bodyParser());

/**
 * GET /feeds/:fid/posts
 */

app.get("/feeds/:fid/posts", loadFeed, function(req, res) {
  if (!req.feed) { return res.send(404); }
  res.send(req.feed._feed_posts);
});

function loadFeed(req, res, next) {
  Feed.findOne({ _id: req.params.fid })
    .populate("_feed_posts")
    .exec(function(err, feed) {
      req.feed = feed;
      next();
    });
}
