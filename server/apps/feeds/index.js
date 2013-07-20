
/**
 * Module dependencies.
 */

var express = require("express"),
    flash = require("connect-flash"),
    getFeedMetaData = require("./get-feed-meta-data"),
    User = require("../../models/user"),
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

app.get("/feeds", function(req, res, next) {
  User.findOne({ _id: req.session.user_id })
    .populate("_subscribes")
    .exec(function(err, user) {
      if (err) { next(err); }
      res.render("index", {
        bodyId: "feeds",
        feeds: user._subscribes
      });
    });
  // Feed.find({
  //   _user: req.session.user_id
  // }, function(err, feeds) {
  //   res.render("index", {
  //     bodyId: "feeds",
  //     feeds: feeds
  //   });
  // });
});

/**
 * POST /feeds
 */

app.post("/feeds", function(req, res, next) {
  var url = req.body.url;

  if (!url) { throw new Error("url is not specified"); }

  // async!!

  getFeedMetaData(url, function(err, meta) {
    if (err) { return next(err); }
    
    User.findOne({ _id: req.session.user_id }, function(err, user) {
      if (err) { return next(err); }
      var feed = new Feed(meta[0]);
      feed.save(function(err) {
        if (err) { return next(err); }
        user._subscribes.push(feed._id);
        user.save(function(err) {
          if (err) { next(err); }
          res.send(feed);
        });
      });
    });
  });
});
