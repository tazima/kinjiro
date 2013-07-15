
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

  it("should create `SubscribeModel", function(done) {
    var spy = sinon.spy(function() {
      expect(spy.called).to.be.ok();
      var created = spy.args[0][0];
      expect(created.get("name")).to.equal("abc");
      expect(created.get("url")).to.equal("http://google.com");
      done();
    });
    this.collection.on("add", spy);

    this.collection.create({
      name: "abc",
      url: "http://google.com"
    });
  });

});