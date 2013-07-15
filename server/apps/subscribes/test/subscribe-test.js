
/**
 * Module dependencies.
 */

var express = require("express"),
    expect = require("expect.js"),
    request = require("supertest"),
    sinon = require("sinon"),
    subscribe = require("../"),
    ObjectId = require("mongoose").Types.ObjectId,
    Request = require("request").Request,
    FeedParser = require('feedparser'),
    setup = require("../../../test/setup"),
    Subscribe = require("../../../models/subscribe");

var app = express();

describe("subscribes", function() {

  var WALKER_ID = new ObjectId();

  var fixture = [
    {
      name: "DailyJS",
      url: "http://feeds.feedburner.com/dailyjs",
      _walker: WALKER_ID
    },
    {
      name: "ROR",
      url: "http://weblog.rubyonrails.org/feed/atom.xml",
      _walker: WALKER_ID
    }
  ];

  before(function(done) {
    app.use(function(req, res, next) {
      // fake walker_id
      req.session = {};
      req.session.walker_id = WALKER_ID;
      next();
    });
    app.use(subscribe);
    setup(done);
  });

  describe("GET /subscribes", function() {
    
    beforeEach(function() {
      this.spy = sinon.stub(Subscribe, "find", function(query, cb) {
        this.query = query;
        cb(null, fixture);
      }.bind(this));
    });

    afterEach(function() {
      Subscribe.find.restore();
    });

    it("should query subscribes with walker_id", function(done) {
      request(app)
        .get("/subscribes")
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be(null);
          expect(this.query).to.have.property("_walker", WALKER_ID);
          done();
        }.bind(this));
    });

    it("should render `subscribes`", function(done) {
      request(app)
        .get("/subscribes")
        .expect(/DailyJS/)
        .expect(/http:\/\/feeds\.feedburner\.com\/dailyjs/)
        .expect(/ROR/)
        .expect(/http:\/\/weblog\.rubyonrails\.org\/feed\/atom\.xml/)
        .expect(200, done);
    });
  });

  describe("POST /subscribes", function() {

    describe("on parser's `meta` event", function() {

      beforeEach(function() {
        sinon.stub(Request.prototype, "pipe", function(dest) {
          this.dest = dest;
          return {
            on: function(event, cb) {
              if (event !== "meta") { return this; }
              cb({
                link: "http://dailyjs.com/",
                title: "DailyJS"
              });
              return this;
            }
          };
        }.bind(this));
        this.subscribeSaveSpy = sinon.spy(Subscribe.prototype, "save");
      });

      afterEach(function() {
        Request.prototype.pipe.restore();
        Subscribe.prototype.save.restore();
      });

      it("should pipe to `FeedParser`", function(done) {
        request(app)
          .post("/subscribes")
          .send({ url: "http://feeds.feedburner.com/dailyjs" })
          .expect(200)
          .end(function(err, res) {
            expect(err).to.be(null);
            expect(this.dest).to.be.a(FeedParser);
            done();
          }.bind(this));
      });

      it("should save subscribe with fetched `url`", function(done) {
        request(app)
          .post("/subscribes")
          .send({ url: "http://feeds.feedburner.com/dailyjs" })
          .expect(200)
          .end(function(err, res) {
            expect(err).to.be(null);
            expect(this.subscribeSaveSpy.thisValues[0])
              .to.have.property("url", "http://dailyjs.com/");
            done();
          }.bind(this));
      });

      it("should save subscribe with fetched `title`", function(done) {
        request(app)
          .post("/subscribes")
          .send({ url: "http://feeds.feedburner.com/dailyjs" })
          .expect(200)
          .end(function(err, res) {
            expect(err).to.be(null);
            expect(this.subscribeSaveSpy.thisValues[0])
              .to.have.property("name", "DailyJS");
            done();
          }.bind(this));
      });
    });
    
  });
  
});
