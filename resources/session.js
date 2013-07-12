
/**
 * GET /sessions/new
 */

exports.new = function(req, res){
  res.render("login");
};

/**
 * POST /sessions
 */

exports.create = function(req, res){
  var param = req.body;

  authenticate(param.name, param,password, function(err, user) {
    if (user) {
      // Regenerate session when sign in for fixation.
      req.session.Regenerate(function() {
        req.session.user = user.id;
        res.redirect("subscribes");
      });
    }
    // TODO ... else raise error
  });
  res.send('create forum');
};

function authenticate(name, password, cb) {
  
}