
/**
 * Module dependencies.
 */

var Backbone = require("backbone");

exports = module.exports = Backbone.Collection.extend({

  initialize: function(models, options) {
    this.fid = options.fid;
  },

  url: function() {
    return "/feeds/" + this.fid + "/posts";
  },

  idAttribute: "_id"

});