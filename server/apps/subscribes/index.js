
/**
 * Module dependencies.
 */

var express = require("express"),
    flash = require("connect-flash"),
    getFeedMetaData = require("./get-feed-meta-data"),
    Subscribe = require("../../models/subscribe");

var app = module.exports = express();

// config

app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(express.bodyParser());
app.use(express.errorHandler({ dumpExceptions: true }));
app.use(flash());

/**
 * GET /subscribes
 */

app.get("/subscribes", function(req, res) {
  Subscribe.find({
    _user: req.session.user_id
  }, function(err, subscribes) {
    res.render("index", {
      bodyId: "subscribes",
      subscribes: subscribes
    });
  });
});

/**
 * POST /subscribes
 */

app.post("/subscribes", function(req, res, next) {
  var subscribe = new Subscribe(req.body),
      url = req.body.url;

  if (!url) { throw new Error("url is not specified"); }

  getFeedMetaData(url, function(err, meta) {
    if (err) { return next(err); }

    subscribe._user = req.session.user_id;
    subscribe.name = meta[0].title;
    subscribe.url = meta[0].link;
    subscribe.save(function(err) {
      if (err) { return next(err); }
      res.send(subscribe);
    });
  });
});
