
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone"),
    FeedItemView = require("feed-item-view");

describe("feed-item-view", function() {

  beforeEach(function() {
    this.model = new Backbone.Model({ title: "hoge", link: "piyo" });
    this.view = new FeedItemView({ model: this.model });
  });

  it("should set tagName as li", function() {
    expect(this.view.render().el.tagName).to.match(/li/i);
  });

  it("should set className as feed-item", function() {
    expect(this.view.render().el.className).to.match(/feed-item/i);
  });

  it("should render models' link", function() {
    expect(this.view.render().$("a").attr("href"))
      .to.equal(this.model.get("link"));
  });

  it("should render models' title", function() {
    expect(this.view.render().$("a").text())
      .to.equal(this.model.get("title"));
  });

});