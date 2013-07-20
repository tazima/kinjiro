
/**
 * Module dependencies.
 */

var nodeio = require("node.io"),
    request = require('request'),
    mongoose = require("mongoose"),
    Feed = require("../../models/feed"),
    Post = require("../../models/post"),
    FeedParser = require('feedparser'),
    root = require("../../../app");

// ad-hoc batch.
// $ ./node_modules/.bin/node.io --debug server/jobs/get-posts
mongoose.createConnection(root.get("db connection string"), function(err) {
  if (err) { throw err; }
  console.log("Connected to mongo db");
});

exports = module.exports = new nodeio.Job({

  input: function (start, num, cb) {
    // stream ?
    Feed.find({}, function(err, docs) {
      console.log(err);
      cb(docs);
    });
  },

  run: function(feed) {
    var job = this;

    request(feed.xmlurl)
      .pipe(new FeedParser)
      .on("error", function(err) { job.fail(err); })
      .on("data", function(article) {
        var post = new Post(article);
        post._id = article.guid;
        post._feed = feed._id;
        post.imageUrl = article.image.url;
        post.imageTitle = article.image.title;
        post.save(function(err, post) {
          if (err) { job.exit(err); }
          feed._feed_posts.push(post._id);
          feed.save(function(err, post) {
            if (err) { job.exit(err); }
            job.emit(post);
          });
        });
      });
  },

  output: function(feeds) {
    console.log(feeds);
  }

});
