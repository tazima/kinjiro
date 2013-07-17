
/**
 * Module dependencies.
 */

var express = require("express"),
    flash = require("connect-flash"),
    FeedParser = require('feedparser'),
    request = require('request'),
    nodeio = require("node.io"),
    fetchFeedUrl = require("./fetch-feed-url"),
    Subscribe = require("../../models/subscribe");

var app = module.exports = express();

// config

app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(express.bodyParser());
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

app.post("/subscribes", function(req, res) {
  var subscribe = new Subscribe(req.body);
  subscribe._user = req.session.user_id;

  // TODO refatoring!
  request(req.body.url)
    .pipe(new FeedParser())
    .on('error', function(err) {
      console.log(err);

      fetchFeedUrl(req.body.url, function(err, result) {
        if (err) {
          res.status(500);
          return res.send({ message: err });
        }

        console.log(result);
        request(result[0])
          .pipe(new FeedParser())
          .on("error", function(err) {
            res.status(500);
            res.send({ message: err.message });
          })
          .on("meta", function(meta) {
            console.log("success fetch");
            subscribe.name = meta.title;
            subscribe.url = meta.link;
            subscribe.save(function(err) {
              if (err) throw err;
              console.log("save");
              res.send(subscribe);
            });
          });
      });
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
