
/**
 * Module dependencies.
 */

var express = require("express"),
    flash = require("connect-flash"),
    staticAsset = require("static-asset"),
    User = require("../../models/user");

var app = module.exports = express();

// config

app.set("views", __dirname);
app.set("view engine", "ejs");

// middleware

app.use(express.bodyParser());
app.use(flash());
app.use(express.static(__dirname + "/build"));
app.use(staticAsset(__dirname + "/build"));

/**
 * GET /users/new
 */

app.get("/users/new", function(req, res) {
  res.render("new", {
    bodyId: "signin",
    messages: req.flash("error")
  });
});

/**
 * POST /users
 */

app.post("/users", function(req, res) {
  var user = new User(req.body.user);

  user.save(function(err) {
    if (err) {
      if (err.code === 11000) {
        req.flash("error", "specified ID is exist");
        return res.redirect("/users/new");
      } else {
        throw err;
      }
    }
    res.redirect("/sessions/new");
  });
});

