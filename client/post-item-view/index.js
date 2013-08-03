
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    Backbone = require("backbone"),
    moment = require("moment");

exports = module.exports = Backbone.View.extend({

  className: "post-item",

  render: function() {
    var json = this.model.toJSON();
    json.pubdate = moment(json.pubdate).format("YYYY-MM-DD");
    this.$el.html(this.template(json));
    return this;
  },

  template: _.template(require("./template"))

});
