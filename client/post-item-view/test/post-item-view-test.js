
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone"),
    PostItemView = require("post-item-view");

describe("post-item-view", function() {

  describe("#render()", function() {

    beforeEach(function() {
      this.model = new Backbone.Model({
        title: "DailyJs",
        description: "Hello, world."
      });
      this.view = new PostItemView({ model: this.model });
    });

    it("should render title", function() {
      this.view.render();
      expect(this.view.$(".title").text()).to.match(/DailyJs/);
    });

    it("should render description", function() {
      this.view.render();
      expect(this.view.$(".description").text()).to.match(/Hello, world/);
    });

  });

});