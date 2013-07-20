
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
  // load feeds
  //  if feeds of fid is not users' one then throw err
  if (!req.feed) { return res.send(404); }

  // var Post = require("../../models/post");

  // request("http://feeds.feedburner.com/dailyjs")
  //   .pipe(new FeedParser)
  //   .on("data", function(article) {
  //     var post = new Post(article);
  //     post._id = article.guid;
  //     post.imageUrl = article.image.url;
  //     post.imageTitle = article.image.title;
  //     post.save(function(err, post) {
  //       console.log(err);
  //       console.log(post);
  //     });
  //   });

  // console.log(req);
  console.log(req.feed._feed_posts);
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
