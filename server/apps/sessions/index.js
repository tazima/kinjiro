
/**
 * Module dependencies.
 */

var express = require("express"),
    Walker = require("../../models/walker");

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

  authenticate(param.name, param.password, function(err, walker) {
    if (walker) {
      req.session.walker_id = walker._id;
      res.redirect("/subscribes");
    } else {
      req.session.walker_id = null;
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

  Walker.findOne({ name: name }, function(err, walker) {
    if (err) throw err;

    if (!walker) {
      return cb(new Error("not logged in"));
    } else {
      walker.comparePassword(password, function(err, isMatch) {
        if (err) throw err;
        if (!isMatch) return cb(new Error("not logged in"));
        return cb(null, walker);
      });
    }
  });
}
