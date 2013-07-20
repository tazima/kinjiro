
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    sinon = require("sinon"),
    async = require("async"),
    ObjectId = require("mongoose").Schema.ObjectId,
    setup = require("../../test/setup"),
    Feed = require("../feed"),
    User = require("../user");

var MONGO_CONN_STRING = "mongodb://localhost:27017/kinjiro-test";

describe("User", function() {

  before(function(done) {
    setup(done);
  });

  beforeEach(function(done) {
    this.feed = new Feed();
    this.feed.save(function(err, feed) {
      this.user = new User({
        name: "foo",
        password: "abc"
      });
      expect(this.user._subscribes).to.not.be(undefined);
      this.user._subscribes.push(feed._id);
      User.remove(done);
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

  it("should save subscribes", function(done) {
    this.user.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc._subscribes).to.not.be(undefined);
      expect(doc._subscribes).to.contain(this.feed._id);
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
