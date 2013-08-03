
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone"),
    FeedCollection = require("feed-collection");

describe("feed-collection", function() {

  beforeEach(function() {
    this.collection = new FeedCollection();
  });

  it("should have url attribute `/feeds`", function() {
    expect(this.collection)
      .to.have.property("url", "/feeds");
  });

  it("model should have idAttribute `_id`", function() {
    var m = new this.collection.model({ _id: "hoge" });
    expect(m.id).to.equal("hoge");
  });

});