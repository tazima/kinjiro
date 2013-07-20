
/**
 * Module dependencies.
 */

var express = require("express"),
    expect = require("expect.js"),
    request = require("supertest"),
    sinon = require("sinon"),
    nock = require("nock"),
    async = require("async"),
    readFileSync = require("fs").readFileSync,
    ObjectId = require("mongoose").Types.ObjectId,
    feed = require("../"),
    FeedParser = require('feedparser'),
    setup = require("../../../test/setup"),
    User = require("../../../models/user"),
    Feed = require("../../../models/feed");

var app = express();

var fixture = require("./fixture");
var feedXml = readFileSync(__dirname + "/sample-feed.xml");
var feedUrlContainHtml = readFileSync(__dirname + "/sample-feed-url-contain.html");
var feedUrlNotContainHtml = readFileSync(__dirname + "/sample-feed-url-not-contain.html");

describe("feeds", function() {

  before(function(done) {
    var self = this;
    async.series([
      function(cb) { User.remove(cb); },
      function(cb) { Feed.remove(cb); },
      function(cb) { Feed.create(fixture, cb); },
      function(cb) {
        Feed.find(function(err, feeds) {
          if (err) { cb(err); }
          self.user = new User({ name: "a", password: "b" });
          self.user._subscribes.push.apply(
            self.user._subscribes,
            feeds.map(function(feed) {
              return feed._id;
            })
          );
          self.user.save(cb);
        });
      },
      function() {
        // fake user_id
        app.use(function(req, res, next) {
          req.session = {};
          req.session.user_id = self.user._id;
          next();
        });
        app.use(feed);
        setup(done);
      }
    ]);
  });

  describe("GET /feeds", function() {
    
    it("should render users' `feeds`", function(done) {
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
      this.userSaveSpy = sinon.spy(User.prototype, "save");
    });

    afterEach(function() {
      Feed.prototype.save.restore();
      User.prototype.save.restore();
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
              .to.have.property("link", "http://dailyjs.com");
            expect(this.feedSaveSpy.thisValues[0])
              .to.have.property("title", "DailyJS");
            done(err);
          }.bind(this));
      });

      it("should add new feeds' id to users' subscribes", function(done) {
        request(app)
          .post("/feeds")
          .send({ url: this.url })
          .expect(200)
          .end(function(err, res) {
            expect(this.userSaveSpy.called).to.be.ok();

            var subscribes = this.userSaveSpy.thisValues[0]._subscribes,
                feedId = this.feedSaveSpy.thisValues[0]._id;

            expect(subscribes).contain(feedId);
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
            expect(res.body).to.have.property("title", "DailyJS");
            expect(res.body)
              .to.have.property("link", "http://dailyjs.com");
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
