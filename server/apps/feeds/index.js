
/**
 * Module dependencies.
 */

var express = require("express"),
    flash = require("connect-flash"),
    getFeedMetaData = require("./get-feed-meta-data"),
    Feed = require("../../models/feed");

var app = module.exports = express();

// config

app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(express.bodyParser());
app.use(express.errorHandler({ dumpExceptions: true }));
app.use(flash());

/**
 * GET /feeds
 */

app.get("/feeds", function(req, res) {
  Feed.find({
    _user: req.session.user_id
  }, function(err, feeds) {
    res.render("index", {
      bodyId: "feeds",
      feeds: feeds
    });
  });
});

/**
 * POST /feeds
 */

app.post("/feeds", function(req, res, next) {
  var feed = new Feed(req.body),
      url = req.body.url;

  if (!url) { throw new Error("url is not specified"); }

  getFeedMetaData(url, function(err, meta) {
    if (err) { return next(err); }

    feed._user = req.session.user_id;
    feed.name = meta[0].title;
    feed.url = meta[0].link;
    feed.save(function(err) {
      if (err) { return next(err); }
      res.send(feed);
    });
  });
});
