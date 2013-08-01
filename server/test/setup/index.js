
/**
 * Module dependencies.
 */

var mongoose = require("mongoose"),
    modelCleaner = require("./mongo-model-cleaner"),
    async = require("async"),
    root = require("../../../app");

exports = module.exports = function(done) {
  modelCleaner(done);
};
