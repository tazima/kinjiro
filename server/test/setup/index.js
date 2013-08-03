
/**
 * Module dependencies.
 */

var modelCleaner = require("./mongo-model-cleaner");

exports = module.exports = function(done) {
  modelCleaner(done);
};
