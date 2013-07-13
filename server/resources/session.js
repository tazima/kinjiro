
/**
 * GET /sessions/new
 */

exports.new = function(req, res){
  res.render("login", { messages: req.flash("error") });
};

/**
 * POST /sessions
 */

exports.create = function(req, res){
  var param = req.body;

  authenticate(param.walker_id, param.password, function(err, walker) {
    if (walker) {
      req.session.walker_id = walker.walker_id;
      console.log(walker);
      res.redirect("subscribes");
    } else {
      req.session.walker_id = null;
      req.flash("error", "Naame or password is incorrect.");
      res.redirect("/");
    }
  });
};

exports.destroy = function(req, res) {
  req.session = null;
  res.redirect("/");
};

// dummy db

var walkers = {
  "valid": {
    walker_id: "valid",
    password: "hoge"
  }
};

function authenticate(walkerId, password, cb) {
  console.log('authenticating %s:%s', walkerId, password);

  // fetch walker;
  var walker = walkers[walkerId];

  if (!walker) {
    return cb(new Error("not logged in"));
  } else {
    return cb(null, walker);
  }
}