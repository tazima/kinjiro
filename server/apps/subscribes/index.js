
/**
 * Module dependencies.
 */

var express = require("express"),
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
    res.render("index", { subscribes: subscribes });
  });
});

/**
 * POST /subscribes
 */

app.post("/subscribes", function(req, res) {
  var subscribe = new Subscribe(req.body);
  subscribe._walker = req.session.walker_id;

  subscribe.save(function(err) {
    if (err) throw err;
    res.send(subscribe);
  });
});

