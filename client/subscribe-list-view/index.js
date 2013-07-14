
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone"),
    SubscribeItemView = require("subscribe-item-view");

exports = module.exports = Backbone.View.extend({

  events: {
    "submit .new-subscribe"   : "create"
  },

  initialize: function() {
    this.collection.on( "add", this.renderOne, this);
  },

  render: function() {
    this.$el.html(this.template());
    this.collection.each(this.renderOne, this);
    return this;
  },

  renderOne: function(model) {
    this.$(".subscribe-list").append(
      (new SubscribeItemView({ model: model }))
        .render().el);
    return this;
  },

  create: function(e) {
    e.preventDefault();
    // TODO name search
    this.collection.create({ name: "hoge", url: this.$(".new-subscribe [type=text]").val() });
  },

  template: _.template(require("./template"))

});
