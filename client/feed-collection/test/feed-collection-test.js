
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

  it("should have idAttribute `_id`", function() {
    expect(this.collection)
      .to.have.property("idAttribute", "_id");
  });

});