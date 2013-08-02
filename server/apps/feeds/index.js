
/**
 * Module dependencies.
 */

var express = require("express"),
    flash = require("connect-flash"),
    async = require("async"),
    staticAsset = require("static-asset"),
    knit = require("knit"),
    debug = require("debug")("http"),
    feedRequest = require("./feed-request"),
    feedModule = require("./module")(),
    User = require("../../models/user"),
    Feed = require("../../models/feed"),
    Post = require("../../models/post");

var app = module.exports = express();

var dependencies = {};

// config

app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(express.bodyParser());
app.use(express.static(__dirname + "/build"));
app.use(staticAsset(__dirname + "/build"));

/**
 * GET /feeds
 */

app.get("/feeds", loadUser("withSubscribes"), function(req, res) {
  res.render("index", {
    bodyId: "feeds",
    feeds: req.user._subscribes
  });
});

/**
 * POST /feeds
 */

app.post("/feeds", inject, loadUser(), function(req, res, next) {
  var url = req.body.url,
      user = req.user;

  if (!url) { throw new Error("url is not specified"); }

  // First, find feed by given url and return this feed if exists.
  Feed.findOne({ _id: url }, function(err, feed) {
    if (!err && feed) { return res.send(feed); }

    var ws = Post.createWriteStream(url);

    function onFinish(user) {
      // TODO upsert
      feed._feed_posts = ws.getPostIds();
      feed.save(function(err, feed) {
        if (err) { return next(err); }
        user._subscribes.push(feed._id);
        user.save(function(err) {
          if (err) { return next(err); }
          res.send(feed);
        });
      });
    }

    // request rss feed
    dependencies.feedRequest(url)
      .on("error", next)
      .on("correcturl", function(correctUrl) {
        url = correctUrl;
      })
      .on("meta", function(meta) {
        feed = new Feed(meta);
        feed._id = url;
      })
      .pipe(ws)
      .on("finish", onFinish.bind(null, user));
  });
});

/**
 * Load and store user data to request.
 * 
 * @param {boolean} withPopulatesSubscribes
 * @api private
 */

function loadUser(withSubscribes) {
  return function(req, res, next) {
    var query = User.findOne({ _id: req.session.user_id }),
        proceedToNext = function(err, user) {
          if (err) { next(err); }
          req.user = user;
          next();
        };

    if (withSubscribes) {
      query
        .populate("_subscribes")
        .exec(proceedToNext);
    } else {
      query
        .exec(proceedToNext);
    }
  };
}

/**
 * inject
 */

function inject(req, res, next) {
  knit.inject(function(feedRequest) {
    dependencies.feedRequest = feedRequest;
    next();
  });
}
