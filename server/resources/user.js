
/**
 * Module dependencies.
 */

var Walker = require("../models/walker");

/**
 * GET /users/new
 */

exports.new = function(req, res) {
  res.render("user/new");
};

/**
 * POST /users
 */

exports.create = function(req, res) {
  var walker = new Walker(req.body);

  walker.save(function(err) {
    if (err) throw err;
    res.redirect("/");
  });
};

