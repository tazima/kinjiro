
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone"),
    SubscribeListView = require("subscribe-list-view");

exports = module.exports = Backbone.View.extend({

  events: {
    "submit .new-subscribe": "create"
  },

  initialize: function() {
    _.bindAll(this, "clearForm", "alertError");
  },

  render: function() {
    var subscribeListView = new SubscribeListView({
      el: this.$(".subscribe-list"),
      collection: this.collection
    });
    subscribeListView.render();
    return this;
  },

  create: function(e) {
    e.preventDefault();
    this.$("[type=submit]").attr("disabled", true);
    this.collection.create({
      url: this.$(".new-subscribe [type=text]").val()
    }, {
      wait: true,
      success: this.clearForm,
      error: this.alertError
    });
  },

  alertError: function(model, response) {
    alert(response.responseText);
    this.clearForm();
  },

  clearForm: function() {
    this.$(".new-subscribe [type=text]").val("");
    this.$("[type=submit]").attr("disabled", false);    
  }

});