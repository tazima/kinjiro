
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    request = require("supertest"),
    sinon = require("sinon"),
    app = require("../"),
    Walker = require("../../../models/walker");

// TODO appecify `test` env via grunt
app.set("db connection string", "mongodb://localhost:27017/kinjiro-test");

describe("users", function() {
  
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
      this.spy = sinon.spy(Walker.prototype, "save");
      Walker.remove(done);
    });

    afterEach(function() {
      Walker.prototype.save.restore();
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

    it("should redirect to `/` after save", function(done) {
      request(app)
        .post("/users")
        .send({ user: { name: "J.T", password: "my password" } })
        .expect(302)
        .end(function(err, res) {
          expect(err).to.be(null);
          expect(res.header.location).to.equal("/");
          done();
        });
    });
  });

});
