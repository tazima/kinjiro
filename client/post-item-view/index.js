
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone"),
    moment = require("moment");

exports = module.exports = Backbone.View.extend({

  className: "post-item",

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
    this.$el.html(this.template(_.extend({ moment: moment }, this.model.toJSON())));
    if (!this.model.get('unread')) { this.$el.addClass('read'); }
    return this;
  },

  /**
   * Make status of this post read.
   */

  makeRead: function(e) {
    if (!this.model.get('unread')) { return; }
    this.$el.addClass('read');
    this.reads.create({ _feed: this.model.get('_feed'), _id: this.model.id });
    this.model.set('unread', false);
  },

  /**
   * Template function.
   */

  template: _.template(require("./template"))

});
