
/**
 * Module dependencies.
 */

var express = require("express"),
    expect = require("expect.js"),
    request = require("supertest"),
    sinon = require("sinon"),
    nock = require("nock"),
    readFileSync = require("fs").readFileSync,
    ObjectId = require("mongoose").Types.ObjectId,
    // Request = require("request").Request,
    feed = require("../"),
    FeedParser = require('feedparser'),
    setup = require("../../../test/setup"),
    Feed = require("../../../models/feed");

var app = express();

var USER_ID = new ObjectId();
var fixture = require("./fixture")(USER_ID);

var feedXml = readFileSync(__dirname + "/sample-feed.xml");
var feedUrlContainHtml = readFileSync(__dirname + "/sample-feed-url-contain.html");
var feedUrlNotContainHtml = readFileSync(__dirname + "/sample-feed-url-not-contain.html");

describe("feeds", function() {

  before(function(done) {
    app.use(function(req, res, next) {
      // fake user_id
      req.session = {};
      req.session.user_id = USER_ID;
      next();
    });
    app.use(feed);
    setup(done);
  });

  describe("GET /feeds", function() {
    
    beforeEach(function() {
      this.spy = sinon.stub(Feed, "find", function(query, cb) {
        this.query = query;
        cb(null, fixture);
      }.bind(this));
    });

    afterEach(function() {
      Feed.find.restore();
    });

    it("should query feeds with user_id", function(done) {
      request(app)
        .get("/feeds")
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be(null);
          expect(this.query).to.have.property("_user", USER_ID);
          done();
        }.bind(this));
    });

    it("should render `feeds`", function(done) {
      request(app)
        .get("/feeds")
        .expect(/DailyJS/)
        .expect(/http:\/\/feeds\.feedburner\.com\/dailyjs/)
        .expect(/ROR/)
        .expect(/http:\/\/weblog\.rubyonrails\.org\/feed\/atom\.xml/)
        .expect(200, done);
    });
  });

  describe("POST /feeds", function() {

    // TODO extract job test

    beforeEach(function() {
      this.feedSaveSpy = sinon.spy(Feed.prototype, "save");
    });

    afterEach(function() {
      Feed.prototype.save.restore();
    });

    describe("with valid feed url", function() {

      beforeEach(function() {
        this.url = "http://feeds.feedburner.com/dailyjs";
        this.scope = nock(this.url)
          .get('/dailyjs')
          .reply(200, feedXml);
      });

      it("should request to feed url", function(done) {
        request(app)
          .post("/feeds")
          .send({ url: this.url })
          .expect(200)
          .end(function(err, res) {
            expect(this.scope.isDone());
            done(err);
          }.bind(this));
      });

      it("should save meta data", function(done) {
        request(app)
          .post("/feeds")
          .send({ url: this.url })
          .expect(200)
          .end(function(err, res) {
            expect(this.feedSaveSpy.called).to.be.ok();
            expect(this.feedSaveSpy.thisValues[0])
              .to.have.property("url", "http://dailyjs.com");
            expect(this.feedSaveSpy.thisValues[0])
              .to.have.property("name", "DailyJS");
            done(err);
          }.bind(this));
      });

      it("should save Feed with user_id", function(done) {
        request(app)
          .post("/feeds")
          .send({ url: this.url })
          .end(function(err, res) {
            expect(this.feedSaveSpy.thisValues[0])
              .to.have.property("_user", USER_ID);
            done(err);
          }.bind(this));
      });

      it("should responde save Feed", function(done) {
        request(app)
          .post("/feeds")
          .send({ url: this.url })
          .end(function(err, res) {
            var id = this.feedSaveSpy.thisValues[0]
                  ._id.toString();
            expect(res.body).to.have.property("_id", id);
            expect(res.body).to.have.property("name", "DailyJS");
            expect(res.body)
              .to.have.property("_user", USER_ID.toString());
            expect(res.body)
              .to.have.property("url", "http://dailyjs.com");
            done(err);
          }.bind(this));
      });
    });

    describe("with invalid feed url", function() {
      describe("scraped html contains feed url", function() {

        beforeEach(function() {
          this.url = "http://dailyjs.com/";
          this.scope = nock(this.url)
            .get("/")
            .reply(200, feedUrlContainHtml)
            .get("/")
            .reply(200, feedUrlContainHtml);
        });

        it("should rquest to feed url", function(done) {
          request(app)
            .post("/feeds")
            .send({ url: this.url })
            .expect(200)
            .end(function(err, res) {
              this.scope.isDone();
              done(err);
            }.bind(this));
        });
      });

      describe("scraped html not have feed url", function() {

        beforeEach(function() {
          this.url = "http://dailyjs.com/";
          this.scope = nock(this.url)
            .get("/")
            .reply(200, feedUrlContainHtml)
            .get("/")
            .reply(200, feedUrlNotContainHtml);
        });

        it("should rquest to feed url", function(done) {
          request(app)
            .post("/feeds")
            .send({ url: this.url })
            .end(function(err, res) {
              this.scope.isDone();
              done();
            }.bind(this));
        });

        it("should respond with err", function(done) {
          request(app)
            .post("/feeds")
            .send({ url: this.url })
            .set('Accept', 'application/json')
            .expect(500, done); // TODO err message verification
        });
      });
    });
    
  });
  
});
