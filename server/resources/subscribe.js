
/**
 * Module dependencies.
 */

var Subscribe = require("../models/subscribe");

/**
 * GET /subscribes
 */

exports.index = function(req, res) {
  // TODO populate subscribes
  console.log(req.session.walker);
  res.render("subscribe/index");
  // res.render("subscribe/index", {
  //   subscribes: Subscribe.find({
  //     walker_id: req.session.walker_id
  //   })
  // });
};