
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone"),
    SubscribeCollection = require("subscribe-collection");

describe("subscribe-collection", function() {

  beforeEach(function() {
    this.collection = new SubscribeCollection;
  });

  it("should have url attribute `/subscribes`", function() {
    expect(this.collection)
      .to.have.property("url", "/subscribes");
  });

  it("should have idAttribute `_id`", function() {
    expect(this.collection)
      .to.have.property("idAttribute", "_id");
  });

});