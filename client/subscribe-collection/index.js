
/**
 * Module dependencies.
 */

var Backbone = require("backbone");

var SubscribeModel = Backbone.Model.extend();

exports = module.exports = Backbone.Collection.extend({
  model: SubscribeModel,
  url: "/subscribes",
  idAttribute: "_id"
});