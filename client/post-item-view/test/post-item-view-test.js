
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
        description: "Hello, world.",
        pubdate: "Fri Jul 26 2013 17:08:00 GMT+0900 (JST)"
      });
      this.view = new PostItemView({ model: this.model });
    });

    it("should render title", function() {
      this.view.render();
      expect(this.view.$(".title").text()).to.match(/DailyJs/);
    });

    it("should render description", function() {
      this.view.render();
      expect(this.view.$el.text()).to.match(/Hello, world/);
    });

    it("should render pubdate", function() {
      this.view.render();
      expect(this.view.$(".pubdate").text()).to.match(/2013-07-26/);
    });

  });

});