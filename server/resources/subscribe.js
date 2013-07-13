
/**
 * Module dependencies.
 */

var Subscribe = require("../models/subscribe");

/**
 * GET /subscribes
 */

exports.index = function(req, res) {
  // TODO populate subscribes
  Subscribe.find({
    _walker: req.session.walker_id
  }, function(err, subscribes) {
    res.render("subscribe/index", { subscribes: subscribes });
  });
};
