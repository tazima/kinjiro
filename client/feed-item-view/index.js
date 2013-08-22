
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone");

exports = module.exports = Backbone.View.extend({

  tagName: "a",

  className: "feed-item list-group-item",

  /**
   * @Override
   */

  initialize: function() {
    this.model.on('change:unread_count', this.updateUnreadCount, this);
  },

  /**
   * @Override
   */

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.attr('href', '#feeds/' + encodeURIComponent(this.model.id) + '/posts');
    this.$el.momentaryClass('animated fadeInUp');
    return this;
  },

  updateUnreadCount: function() {
    var count = this.model.get('unread_count');
    this.$('.unread').text(count > 0 ? count : '');
    this.$('.unread').momentaryClass('animated pulse');
  },

  /**
   * template
   */

  template: _.template(require("./template"))

});
