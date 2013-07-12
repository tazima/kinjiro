
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

  authenticate(param.user, param.password, function(err, user) {
    if (user) {
      req.session.user = user;
      res.redirect("subscribes");
    } else {
      req.session.user = null;
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

var users = {
  "valid": {
    user: "valid",
    password: "hoge"
  }
};

function authenticate(user, password, cb) {
  console.log('authenticating %s:%s', user, password);

  // fetch user;
  user = users[user];

  if (!user) {
    return cb(new Error("not logged in"));
  } else {
    return cb(null, user);
  }
}