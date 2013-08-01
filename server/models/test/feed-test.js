
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    sinon = require("sinon"),
    async = require("async"),
    ObjectId = require("mongoose").Types.ObjectId,
    setup = require("../../test/setup"),
    Feed = require("../feed"),
    Post = require("../post");

var MONGO_CONN_STRING = "mongodb://localhost:27017/kinjiro-test";

describe("Feed", function() {

  before(function(done) {
    setup(done);
  });

  beforeEach(function(done) {
    async.waterfall([
      function(cb) { Post.create({ _id: "hoge" }, cb); },
      function(post, cb) {
        this.post = post;
        this.feed = new Feed({
          _id: "http://feeds.feedburner.com/dailyjs",
          title: "DailyJS",
          link: "http://dailyjs.com",
          favicon: "http://hoge"
        });
        this.feed._feed_posts.push(post._id);
        cb(null);
      }.bind(this),
      function(cb) { Feed.remove(cb); },
      function(feed, cb) { Post.remove(cb); }
    ], done);
  });

  it("should save `title`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc.title).to.equal("DailyJS");
      done(err);
    });
  });

  it("should save `_id`", function(done) {
    this.feed.save(function(err, doc) {
      expect(doc._id).to.equal("http://feeds.feedburner.com/dailyjs");
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

  it("should save `posts`", function(done) {
    this.feed.save(function(err, doc) {
      
      expect(doc._feed_posts).to.contain(this.post._id);
      done(err);
    }.bind(this));
  });

});
