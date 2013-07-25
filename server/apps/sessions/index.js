
/**
 * Module dependencies.
 */

var express = require("express"),
    User = require("../../models/user");

var app = module.exports = express();

// config

app.set("views", __dirname);
app.set("view engine", "ejs");

/**
 * GET /sessions/new
 */

app.get("/sessions/new", function(req, res) {
  res.render("new", {
    bodyId: "login",
    messages: req.flash("error")
  });
});

/**
 * POST /sessions
 */

app.post("/sessions", function(req, res) {
  var param = req.body;

  authenticate(param.name, param.password, function(err, user) {
    if (user) {
      req.session.user_id = user._id;
      res.redirect("/feeds");
    } else {
      req.session.user_id = null;
      req.flash("error", "Naame or password is incorrect.");
      res.redirect("/");
    }
  });
});

/**
 * DEL /session
 */

app.del("/session", function(req, res) {
  req.session = null;
  res.redirect("/");
});

/**
 * Authenticate user by given name and password.
 * 
 * @param name
 * @param password
 * @param cb
 */

function authenticate(name, password, cb) {
  console.log('authenticating %s:%s', name, password);

  User.findOne({ name: name }, function(err, user) {
    if (err) { throw err; }

    if (!user) {
      return cb(new Error("not logged in"));
    } else {
      user.comparePassword(password, function(err, isMatch) {
        if (err) { throw err; }
        if (!isMatch) { return cb(new Error("not logged in")); }
        return cb(null, user);
      });
    }
  });
}
