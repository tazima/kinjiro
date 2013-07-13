
/**
 * Module dependencies.
 */

var Walker = require("../models/walker");

/**
 * GET /sessions/new
 */

exports.new = function(req, res){
  res.render("session/new", { messages: req.flash("error") });
};

/**
 * POST /sessions
 */

exports.create = function(req, res){
  var param = req.body;

  authenticate(param.name, param.password, function(err, walker) {
    if (walker) {
      req.session.walker_id = walker._id;
      res.redirect("subscribes");
    } else {
      req.session.walker_id = null;
      req.flash("error", "Naame or password is incorrect.");
      res.redirect("/");
    }
  });
};

/**
 * DEL /sessions/:session
 */

exports.destroy = function(req, res) {
  req.session = null;
  res.redirect("/");
};

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