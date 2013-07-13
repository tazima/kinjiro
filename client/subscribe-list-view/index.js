
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone");

var dummyList = require("./dummy-list.json");

exports = module.exports = Backbone.View.extend({

  render: function() {
    this.$el.html(this.template({ contents: dummyList }));
    return this;
  },

  template: _.template(require("./template"))

});
