
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
    this.userId = new ObjectId();
    this.feed = new Feed({
      name: "DailyJS",
      url: "http://feeds.feedburner.com/dailyjs",
      _user: this.userId
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

  it("should save `_user` ref", function(done) {
    this.feed.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc._user).to.equal(this.userId);
      done();
    }.bind(this));    
  });

});
