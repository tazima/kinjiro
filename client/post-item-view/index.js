
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone"),
    moment = require("moment");

exports = module.exports = Backbone.View.extend({

  className: "post-item",

  render: function() {
    this.$el.html(this.template(_.extend({ moment: moment }, this.model.toJSON())));
    return this;
  },

  template: _.template(require("./template"))

});
