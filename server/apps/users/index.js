
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
 * GET /users/new
 */

app.get("/users/new", function(req, res) {
  res.render("new", { bodyId: "signin" });
});

/**
 * POST /users
 */

app.post("/users", function(req, res) {
  var walker = new Walker(req.body);

  walker.save(function(err) {
    if (err) throw err;
    res.redirect("/");
  });
});

