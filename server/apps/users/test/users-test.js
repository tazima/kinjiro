
/**
 * Module dependencies.
 */

var express = require("express"),
    expect = require("expect.js"),
    request = require("supertest"),
    sinon = require("sinon"),
    async = require("async"),
    user = require("../"),
    setup = require("../../../test/setup"),
    User = require("../../../models/user");

var app = express();

describe("users", function() {

  before(function(done) {
    var self = this;
    async.series([
      function(cb) { setup(cb); },
      function(cb) {
        var user = new User({ name: "a", password: "b" });
        user.save(cb);
      },
      function() {
        // fake user_id
        app.use(function(req, res, next) {
          req.session = {};
          req.session.user_id = self.user._id;
          next();
        });
        app.use(user);
        done();
      }
    ]);
  });
  
  describe("GET /users/new", function() {
    it("should have user[name] field", function(done) {
      request(app)
        .get("/users/new")
        .expect(/user\[name\]/)
        .expect(200, done);
    });

    it("should have user[password] field", function(done) {
      request(app)
        .get("/users/new")
        .expect(/user\[password\]/)
        .expect(200, done);
    });
  });

  describe("POST /users", function() {
    beforeEach(function(done) {
      this.spy = sinon.spy(User.prototype, "save");
      User.remove(done);
    });

    afterEach(function() {
      User.prototype.save.restore();
    });

    it("should save user name", function(done) {
      request(app)
        .post("/users")
        .send({ user: { name: "J.T", password: "my password" } })
        .expect(200, function() {
          expect(this.spy.thisValues[0].name).to.equal("J.T");
          done();
        }.bind(this));
    });

    it("should save encripted user password", function(done) {
      request(app)
        .post("/users")
        .send({ user: { name: "J.T", password: "my password" } })
        .end(function() {
          expect(this.spy.thisValues[0].password)
            .to.not.be(undefined);
          expect(this.spy.thisValues[0].password)
            .to.not.equal("my password");
          done();
        }.bind(this));
    });

    it("should redirect to `/sessions/new` after save", function(done) {
      request(app)
        .post("/users")
        .send({ user: { name: "J.T", password: "my password" } })
        .expect(302)
        .end(function(err, res) {
          expect(err).to.be(null);
          expect(res.header.location).to.equal("/sessions/new");
          done();
        });
    });
  });

});
