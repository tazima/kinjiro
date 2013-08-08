
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    sinon = require("sinon"),
    async = require("async"),
    ObjectId = require("mongoose").Schema.ObjectId,
    setup = require("../../test/setup");

var User, Feed;

var MONGO_CONN_STRING = "mongodb://localhost:27017/kinjiro-test";

describe("User", function() {

  beforeEach(function(done) {
    setup(done);
  });

  beforeEach(function(done) {
    Feed = require("../feed");
    User = require("../user");
    this.feed = new Feed({
      _id: "http://feeds.feedburner.com/dailyjs",
      link: "http://dailyjs.com/",
      title: "DailyJS"
    });
    this.feed.save(function(err, feed) {
      this.user = new User({
        name: "foo",
        password: "abc"
      });
      expect(this.user.subscribes).to.not.be(undefined);
      this.user.subscribes.push({ _feed: feed._id });
      done();
    }.bind(this));
  });

  it("should save `name`", function(done) {
    this.user.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc.name).to.equal("foo");
      done();
    });
  });

  it("should save encripted password", function(done) {
    this.user.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc.password).to.not.equal("abc");
      done();
    });
  });

  it("should save subscribed feeds", function(done) {
    this.user.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc.subscribes).to.not.be.empty();
      expect(doc.subscribes[0]).to.have.property('_feed', this.feed._id);
      done();
    }.bind(this));
  });

  it("should have subscribed feed's unread count default to 0", function(done) {
    this.user.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc.subscribes[0]).to.have.property('unread_count', 0);
      done();
    }.bind(this));
  });

  it("should pass err if name is not specified", function(done) {
    this.user.set("name", null);
    this.user.save(function(err, doc) {
      expect(err).to.not.be(null);
      expect(err.name).to.equal("ValidationError");
      done();
    });
  });

  it("should pass err if password is not specified", function(done) {
    this.user.set("password", null);
    this.user.save(function(err, doc) {
      expect(err).to.not.be(null);
      expect(err.message).to.match(/Validation failed/);
      done();
    });
  });

  it("should not save duplicate model nmae", function(done) {
    var self = this;
    async.series([
      function(cb) { self.user.save(cb); },
      function() {
        var dup = new User({ name: "foo", password: "abc" });
        dup.save(function(err, doc) {
          expect(err).to.not.be(null);
          expect(err.message).to.match(/duplicate/);
          done();
        });
      }
    ]);
  });
});
