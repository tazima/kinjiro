
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    sinon = require("sinon"),
    async = require("async"),
    mongoose = require("mongoose"),
    Walker = require("../walker");

var MONGO_CONN_STRING = "mongodb://localhost:27017/kinjiro-test";

describe("Walker", function() {

  before(function(done) {
    mongoose.createConnection(MONGO_CONN_STRING, done);
  });

  beforeEach(function(done) {
    this.walker = new Walker({ name: "foo", password: "abc" });
    Walker.remove(done);
  });

  it("should save `name`", function(done) {
    this.walker.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc.name).to.equal("foo");
      done();
    });
  });

  it("should save encripted password", function(done) {
    this.walker.save(function(err, doc) {
      expect(err).to.be(null);
      expect(doc.password).to.not.be(undefined);
      expect(doc.password).to.not.equal("abc");
      done();
    });
  });

  it("should pass err if name is not specified", function(done) {
    this.walker.set("name", null);
    this.walker.save(function(err, doc) {
      expect(err).to.not.be(null);
      expect(err.name).to.equal("ValidationError");
      done();
    });
  });

  it("should pass err if password is not specified", function(done) {
    this.walker.set("password", null);
    this.walker.save(function(err, doc) {
      expect(err).to.not.be(null);
      expect(err.message).to.match(/Validation failed/);
      done();
    });
  });

  it("should not save duplicate model nmae", function(done) {
    var self = this;
    async.series([
      function(cb) { self.walker.save(cb); },
      function() {
        var dup = new Walker({ name: "foo", password: "abc" });
        dup.save(function(err, doc) {
          expect(err).to.not.be(null);
          expect(err.message).to.match(/duplicate/);
          done();
        });
      }
    ]);
  });
});
