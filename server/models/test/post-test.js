
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    sinon = require("sinon"),
    async = require("async"),
    ObjectId = require("mongoose").Types.ObjectId,
    setup = require("../../test/setup"),
    Post = require("../post");

var MONGO_CONN_STRING = "mongodb://localhost:27017/kinjiro-test";

describe("Post", function() {

  before(function(done) {
    setup(done);
  });

  beforeEach(function(done) {
    this.feed = new Post({
      _id: "http://dailyjs.com/2013/07/31/node-roundup",
      _feed: "http://feeds.feedburner.com/dailyjs",
      title: "Node Roundup: 0.10.15",
      description: "my description",
      summary: "my summary",
      pubdate: "2013-07-31T00:00:00+01:00"
    });
    Post.remove(done);
  });

  it("should save `_id`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc._id).to.equal("http://dailyjs.com/2013/07/31/node-roundup");
      done(err);
    });
  });

  it("should save `_feed`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc._feed).to.equal("http://feeds.feedburner.com/dailyjs");
      done(err);
    });
  });

  it("should save `title`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc.title).to.equal("Node Roundup: 0.10.15");
      done(err);
    });
  });

  it("should save `description`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc.description).to.equal("my description");
      done(err);
    });
  });

  it("should save `summary`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc.summary).to.equal("my summary");
      done(err);
    });
  });

  it("should save `pubdate`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc.pubdate).to.equal("2013-07-31T00:00:00+01:00");
      done(err);
    });
  });

});
