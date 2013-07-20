
/**
 * Module dependencies.
 */

var Backbone = require("backbone");

var FeedModel = Backbone.Model.extend();

exports = module.exports = Backbone.Collection.extend({
  model: FeedModel,
  url: "/feeds",
  idAttribute: "_id"
});