
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
    _.bindAll(this, "navigateToPosts", "alertError");
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
    var url = this.$(".subscribe [type=text]").val();
    this.$("[type=submit]").attr("disabled", true);
    this.collection.create({ url: url }, {
      wait: true,
      success: this.navigateToPosts,
      error: this.alertError
    });
  },

  navigateToPosts: function(model) {
    Backbone.history.navigate("feeds/" + encodeURIComponent(model.id) + "/posts",
                              { trigger: true });
    this.clearForm();
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