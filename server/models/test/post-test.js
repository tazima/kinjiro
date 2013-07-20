
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
      title: "DailyJS",
      xmlurl: "http://feeds.feedburner.com/dailyjs",
      link: "http://dailyjs.com",
      favicon: "http://hoge"
    });
    Feed.remove(done);
  });

  it("should save `title`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc.title).to.equal("DailyJS");
      done(err);
    });
  });

  it("should save `xmlurl`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc.xmlurl).to.equal("http://feeds.feedburner.com/dailyjs");
      done(err);
    });
  });

  it("should save `link`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc.link).to.equal("http://dailyjs.com");
      done(err);
    });
  });

  it("should save `favicon`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc.favicon).to.equal("http://hoge");
      done(err);
    });
  });

});
