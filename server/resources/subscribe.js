
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

/**
 * POST /subscribes
 */

exports.create = function(req, res) {
  var subscribe = new Subscribe(req.body);
  subscribe._walker = req.session.walker_id;

  subscribe.save(function(err) {
    if (err) throw err;
    res.send(subscribe);
  });
};
