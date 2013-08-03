
/**
 * Module dependencies.
 */

var Backbone = require("backbone");

var FeedModel = Backbone.Model.extend({
  idAttribute: "_id"
});

exports = module.exports = Backbone.Collection.extend({
  model: FeedModel,
  url: "/feeds"
});