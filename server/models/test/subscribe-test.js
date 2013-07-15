
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    sinon = require("sinon"),
    async = require("async"),
    ObjectId = require("mongoose").Types.ObjectId,
    setup = require("../../test/setup"),
    Subscribe = require("../subscribe");

var MONGO_CONN_STRING = "mongodb://localhost:27017/kinjiro-test";

describe("Subscribe", function() {

  before(function(done) {
    setup(done);
  });

  beforeEach(function(done) {
    this.walkerId = new ObjectId();
    this.subscribe = new Subscribe({
      name: "DailyJS",
      url: "http://feeds.feedburner.com/dailyjs",
      _walker: this.walkerId
    });
    Subscribe.remove(done);
  });

  it("should save `name`", function(done) {
    this.subscribe.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc.name).to.equal("DailyJS");
      done();
    });
  });

  it("should save `url`", function(done) {
    this.subscribe.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc.url).to.equal("http://feeds.feedburner.com/dailyjs");
      done();
    });
  });

  it("should save `_walker` ref", function(done) {
    this.subscribe.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc._walker).to.equal(this.walkerId);
      done();
    }.bind(this));    
  });

});
