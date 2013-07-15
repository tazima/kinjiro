
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone"),
    SubscribeItemView = require("subscribe-item-view");

exports = module.exports = Backbone.View.extend({

  events: {
    "submit .new-subscribe": "create"
  },

  initialize: function() {
    _.bindAll(this, "enableAddButton", "alertError");
    this.collection.on("add", this.renderOne, this);
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
    this.$("[type=submit]").attr("disabled", true);
    this.collection.create({
      url: this.$(".new-subscribe [type=text]").val()
    }, {
      wait: true,
      success: this.enableAddButton,
      error: this.alertError
    });
  },

  alertError: function(model, response) {
    alert(response.responseText);
    this.enableAddButton();
  },

  enableAddButton: function() {
    this.$("[type=submit]").attr("disabled", false);    
  },

  template: _.template(require("./template"))

});
