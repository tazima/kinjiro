
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone");

exports = module.exports = Backbone.View.extend({

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  template: _.template(require("./template"))

});
