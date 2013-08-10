
/**
 * Module dependencies.
 */

var Backbone = require("backbone");

var PostModel = Backbone.Model.extend({

  idAttribute: "_id"

});

exports = module.exports = Backbone.Collection.extend({

  model: PostModel,

  initialize: function(models, options) {
    this.fid = options.fid;
  },

  url: function() {
    return "/feeds/" + encodeURIComponent(this.fid) + "/posts";
  }

});
