
/**
 * Module dependencies.
 */

var express = require("express"),
    FeedParser = require('feedparser'),
    request = require('request'),
    Subscribe = require("../../models/subscribe");

var app = module.exports = express();

// config

app.set("views", __dirname);
app.set("view engine", "ejs");

/**
 * GET /subscribes
 */

app.get("/subscribes", function(req, res) {
  Subscribe.find({
    _walker: req.session.walker_id
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

app.post("/subscribes", function(req, res) {
  var subscribe = new Subscribe(req.body);
  subscribe._walker = req.session.walker_id;

  request(req.body.url)
    .pipe(new FeedParser())
    .on('error', function(err) {
      res.status(500);
      res.send({ message: err.message });
    })
    .on('meta', function (meta) {
      // TODO adjust property names
      subscribe.name = meta.title;
      subscribe.url = meta.link;
      subscribe.save(function(err) {
        if (err) throw err;
        res.send(subscribe);
      });
    });

});

