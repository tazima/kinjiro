
/**
 * Module dependencies.
 */

var mongoose = require("mongoose"),
    root = require("../../../app");

exports = module.exports = function(done) {
  mongoose.createConnection(root.get("db connection string"), done);
};
