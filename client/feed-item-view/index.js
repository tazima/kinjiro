
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone");

exports = module.exports = Backbone.View.extend({

  tagName: "li",

  className: "feed-item",

  /**
   * @Override
   */

  initialize: function() {
    this.model.on('change', this.render, this);
  },

  /**
   * @Override
   */

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  /**
   * template
   */

  template: _.template(require("./template"))

});
