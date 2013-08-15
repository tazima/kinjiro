
/**
 * Module dependencies.
 */

var express = require("express"),
    User = require("../../models/user");

var app = module.exports = express();

// config

app.use(express.bodyParser());
app.use(express.errorHandler());

/**
 * POST /reads
 */

app.post("/reads", function(req, res) {
  User.findOne({ _id: req.session.user_id }, function(err, user) {
    if (err) { throw err; }

    var i, l, s;

    user._read_posts.push(req.body._id);

    // TODO make async
    for (i = 0, l = user.subscribes.length; i < l; i++) {
      s = user.subscribes[i];
      if (s._feed === req.body._feed) {
        --s.unread_count;
        break;
      }
    }

    user.save(function() { res.send(200); });
  });
});
