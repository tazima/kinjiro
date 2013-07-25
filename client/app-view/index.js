
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone"),
    FeedListView = require("feed-list-view");

exports = module.exports = Backbone.View.extend({

  events: {
    "submit .subscribe": "create"
  },

  initialize: function() {
    _.bindAll(this, "clearForm", "alertError");
  },

  render: function() {
    var feedListView = new FeedListView({
      el: this.$(".feed-list"),
      collection: this.collection
    });
    feedListView.render();
    return this;
  },

  create: function(e) {
    e.preventDefault();
    this.$("[type=submit]").attr("disabled", true);
    this.collection.create({
      url: this.$(".subscribe [type=text]").val()
    }, {
      wait: true,
      success: this.clearForm,
      error: this.alertError
    });
  },

  alertError: function(model, response) {
    /*global alert:true */
    alert(response.responseText);
    this.clearForm();
  },

  clearForm: function() {
    this.$(".subscribe [type=text]").val("");
    this.$("[type=submit]").attr("disabled", false);    
  }

});