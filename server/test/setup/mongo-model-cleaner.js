
/**
 * Module dependencies.
 */

var mongoose = require("mongoose"),
    async = require("async");

exports = module.exports = modelCleaner;

function modelCleaner(cb) {
  var tasks = Object.keys(mongoose.models).map(function(key) {
    return function(cb) {
      mongoose.models[key].remove(cb);
    };
  });
  async.series(tasks, function() { cb(); });
}
