
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone");

exports = module.exports = Backbone.View.extend({

  tagName: "a",

  className: "feed-item list-group-item",

  active: function() {
    console.log("active");
  },

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
    this.$el.attr('href', '#feeds/' + encodeURIComponent(this.model.id) + '/posts');
    return this;
  },

  /**
   * template
   */

  template: _.template(require("./template"))

});
