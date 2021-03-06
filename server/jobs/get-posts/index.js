/**
 * Module dependencies.
 */

var _ = require("underscore"),
    nodeio = require("node.io"),
    mongoose = require("mongoose"),
    request = require("request"),
    debug = require("debug")("job"),
    FeedParser = require("feedparser"),
    Feed = require("../../models/feed"),
    Post = require("../../models/post"),
    root = require("../../../app");

mongoose.createConnection(root.get("db connection string"), function(err) {
  if (err) { throw err; }
  debug("Connected to mongo db");
});

/**
 * Get and store posts of feeds who met conditions.
 *
 * Condition:
 *  - a feed that has been crawled before specified ms ago
 *  - a feed that has nerver crawled
 *
 * Usage:
 *
 *  $ node.io index.js 3600000
 */

exports.job = new nodeio.Job({
  wait: 1
}, {

  init: function() {
    if (this.options.args.length > 0) {
      this.options.interval = parseInt(this.options.args, 10);
    } else {
      this.options.interval = 1000 * 60 * 60; // default to 1 hour
    }
  },

  input: function(start, num, callback) {
    var job = this;
    Feed
      .find({
        $or: [
          {
            $and: [
              // last crawl was end,
              { crawlEnd: true },
              // and last crawl was completed before specified time ago
              { lastCrawlDate: {
                $lt: new Date((new Date()).getTime() - job.options.interval) }}
            ]
          },
          // or new one
          { lastCrawlDate: null }
        ]
      })
      .exec(function(err, feeds) {
        if (err) { job.exit(err); }
        if (feeds.length === 0) {
          callback([null]);
        } else {
          callback(feeds);
        }
      });
  },

  run: function(line) {
    var job = this;

    // skip this run if input is null,
    if (line == null) { return job.skip(); }

    Feed.findOne({ _id: line._id }, function(err, feed) {
      if (err) { return job.exit(); }

      feed.crawlEnd = false;
      feed.save(function(err, feed) {
        if (err) { return job.exit(); }

        var postWritableStream = Post.createWriteStream(feed._id);

        request(feed._id)
          .pipe(new FeedParser())
          .pipe(postWritableStream)
          .on("error", function(err) { job.exit(err); })
          .on("finish", function() {
            var newIds = postWritableStream.getPostIds();
            feed._feed_posts = _.uniq(feed._feed_posts.concat(newIds),
                                      function(a) { return a.toString(); });
            feed.lastCrawlDate = new Date();
            feed.crawlEnd = true;
            feed.save(function(err, feed) {
              if (err) { return job.exit(); }
              job.emit(feed);
            });
          });
      });
    });
  }
});
