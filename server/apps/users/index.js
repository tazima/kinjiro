
/**
 * Module dependencies.
 */

var express = require("express"),
    flash = require("connect-flash"),
    Walker = require("../../models/walker");

var app = module.exports = express();

// config

app.set("views", __dirname);
app.set("view engine", "ejs");

// middleware

app.use(express.bodyParser());
app.use(express.cookieParser());
// TODO make secret secret!
app.use(express.cookieSession({ secret: 'shhhh, very secret' }));
app.use(flash());

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
  var walker = new Walker(req.body.user);

  walker.save(function(err) {
    if (err) {
      if (err.code === 11000) {
        req.flash("error", "specified ID is exist");
        return res.redirect("/users/new");
      } else {
        throw err;
      }
    }
    res.redirect("/");
  });
});

