
/**
 * Module dependencies.
 */

var express = require("express"),
    flash = require("connect-flash"),
    async = require("async"),
    staticAsset = require("static-asset"),
    getFeedMetaData = require("../../jobs/get-feed-meta-data"),
    User = require("../../models/user"),
    Feed = require("../../models/feed");

var app = module.exports = express();

// config

app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(express.bodyParser());
app.use(express.errorHandler({ dumpExceptions: true }));
app.use(flash());
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

app.post("/feeds", loadUser(), function(req, res, next) {
  var url = req.body.url;

  if (!url) { throw new Error("url is not specified"); }

  getFeedMetaData(url, function(err, meta) {
    if (err) { return next(err); }
    
    var feed = new Feed(meta[0]);
    feed.save(function(err) {
      if (err) { return next(err); }
      req.user._subscribes.push(feed._id);
      req.user.save(function(err) {
        if (err) { next(err); }
        res.send(feed);
      });
    });
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

