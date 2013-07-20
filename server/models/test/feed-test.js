
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    sinon = require("sinon"),
    async = require("async"),
    ObjectId = require("mongoose").Types.ObjectId,
    setup = require("../../test/setup"),
    Feed = require("../feed");

var MONGO_CONN_STRING = "mongodb://localhost:27017/kinjiro-test";

describe("Feed", function() {

  before(function(done) {
    setup(done);
  });

  beforeEach(function(done) {
    this.feed = new Feed({
      name: "DailyJS",
      url: "http://feeds.feedburner.com/dailyjs"
    });
    Feed.remove(done);
  });

  it("should save `name`", function(done) {
    this.feed.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc.name).to.equal("DailyJS");
      done();
    });
  });

  it("should save `url`", function(done) {
    this.feed.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc.url).to.equal("http://feeds.feedburner.com/dailyjs");
      done();
    });
  });

});
