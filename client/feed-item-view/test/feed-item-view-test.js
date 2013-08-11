
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone"),
    FeedItemView = require("feed-item-view");

describe("feed-item-view", function() {

  beforeEach(function() {
    this.model = new Backbone.Model({
      _id: "http://feeds.feedburner.com/dailyjs",
      id: "http://feeds.feedburner.com/dailyjs",
      title: "hoge",
      link: "piyo",
      unread_count: 10
    });
    this.model.idAttribute = "_id";
    this.view = new FeedItemView({ model: this.model });
  });

  it("should set tagName as a", function() {
    expect(this.view.render().el.tagName).to.match(/a/i);
  });

  it("should set className as feed-item", function() {
    expect(this.view.render().el.className).to.match(/feed-item/i);
  });

  it("should have anchor to its' posts", function() {
    expect(this.view.render().$el.attr("href"))
      .to.equal("#feeds/" + encodeURIComponent(this.model.get("_id")) + "/posts");
  });

  it("should render models' title", function() {
    expect(this.view.render().$el.text())
      .to.match(new RegExp(this.model.get("title")));
  });

  it("should render unread count", function() {
    expect(this.view.render().$(".unread").text())
      .to.match(/10/);
  });

});
