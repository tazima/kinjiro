
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
    console.log(arguments);
    Feed.find({}, function(err, docs) {
      console.log(err);
      cb(docs);
    });
    if (start > 2) cb(false);
  },


  run: function(feed) {
    var job = this,
        postIds = [];

    // console.log(feed);

    request(feed.xmlurl)
      .pipe(new FeedParser)
      .on("error", function(err) { job.fail(err); })
      .on("data", function(article) {
        console.log(article);
        Post.update({ _id: article.guid }, {
          _feed: feed._id,
          title: article.title,
          description: article.description,
          summary: article.summary,
          imageUrl: article.image.url || "",
          imageTitle: article.image.title || ""
        }, { upsert: true }, function(err) {
          if (err) { job.exit(err); }
          postIds.push(article.guid);
        });
      })
      .on("end", function() {
        // console.log(postIds);
        feed._feed_posts = postIds;
        feed.save(function(err, post) { 
          if (err) { job.exit(err); }
          job.emit(post);
        });
      });
  },

  output: function(feeds) {
    // console.log(feeds);
  }

});
