
/**
 * Module dependencies.
 */

var _ = require('underscore'),
    Backbone = require('backbone'),
    strftime = require('strftime');

/**
 * Expose post item view.
 */

exports = module.exports = Backbone.View.extend({

  className: 'post-item',

  tagName: 'li',

  /**
   * @Override
   */

  initialize: function(options) {
    this.reads = options.reads;
    this.$el.on('post.read', _.bind(this.makeRead, this));
  },

  /**
   * @Override
   */

  render: function() {
    this.$el.html(this.template(_.extend({ strftime: strftime }, this.model.toJSON())));
    this.makeImagesResponsive();
    if (!this.model.get('unread')) { this.$el.addClass('read'); }
    return this;
  },

  /**
   * Make status of this post read.
   *
   * @api private
   */

  makeRead: function(e) {
    if (!this.model.get('unread')) { return; }
    this.$el.addClass('read');
    this.reads.create({ _feed: this.model.get('_feed'), _id: this.model.id });
    this.model.set('unread', false);
  },

  /**
   * Make images Bootstrap responsive.
   *
   * @api private
   */

  makeImagesResponsive: function() {
    this.$('img').addClass('img-responsive');
  },

  /**
   * Template function.
   */

  template: _.template(require('./template'))

});
