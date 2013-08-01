
/**
 * Module dependencies.
 */

var express = require("express"),
    expect = require("expect.js"),
    async = require("async"),
    request = require("supertest"),
    sinon = require("sinon"),
    nodeio = require("node.io"),
    Feed = require("../../../models/feed"),
    User = require("../../../models/user"),
    setup = require("../../../test/setup"),
    feed = require("../");

var app = express();

var fixture = require("./fixture");

describe("feeds", function() {

  beforeEach(function(done) {
    var self = this;
    async.series([
      function(cb) { setup(cb); },
      function(cb) { Feed.create(fixture, cb); },
      function(cb) {
        // make user to subscribe feeds.
        Feed.find(function(err, feeds) {
          if (err) { cb(err); }
          self.user = new User({ name: "a", password: "b" });
          self.user._subscribes.push.apply(
            self.user._subscribes,
            feeds.map(function(feed) { return feed._id; })
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
        done();
      }
    ]);
  });

  describe("GET /feeds", function() {
    
    it("should respond users' `feeds`", function(done) {
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

    beforeEach(function() {
      this.feedSaveSpy = sinon.spy(Feed.prototype, "save");
      this.userSaveSpy = sinon.spy(User.prototype, "save");
      this.url = "http://piyopiyo";
    });

    afterEach(function() {
      Feed.prototype.save.restore();
      User.prototype.save.restore();
    });

    describe("when `getFeedMetaData` success", function() {

      beforeEach(function() {
        // mock getFeedMetaData job
        var self = this;
        self.jobMock = new nodeio.Job({
          input: ["http://www.1101.com/home.html"],
          run: function() {
            this.emit({
              xmlurl: "http://www.1101.com/rss/index.html",
              link: "http://www.1101.com/home.html",
              title: "ほぼ日刊イトイ新聞"
            });
          }
        });
        self.JobStub = sinon.stub(nodeio, "Job", function() { return self.jobMock; });
      });

      afterEach(function() {
        nodeio.Job.restore();
      });

      it("should save meta data", function(done) {
        request(app)
          .post("/feeds")
          .send({ url: this.url })
          .expect(200)
          .end(function(err, res) {
            expect(this.feedSaveSpy.called).to.be.ok();
            expect(this.feedSaveSpy.thisValues[0])
              .to.have.property("link", "http://www.1101.com/home.html");
            expect(this.feedSaveSpy.thisValues[0])
              .to.have.property("title", "ほぼ日刊イトイ新聞");
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

      it("should responde with saved Feed", function(done) {
        request(app)
          .post("/feeds")
          .send({ url: this.url })
          .end(function(err, res) {
            var id = this.feedSaveSpy.thisValues[0]
                  ._id.toString();
            expect(res.body).to.have.property("_id", id);
            expect(res.body).to.have.property("title", "ほぼ日刊イトイ新聞");
            expect(res.body)
              .to.have.property("link", "http://www.1101.com/home.html");
            done(err);
          }.bind(this));
      });
    });

    describe("when `getFeedMetaData` fail", function() {

      beforeEach(function() {
        // mock getFeedMetaData job
        var self = this;
        self.jobMock = new nodeio.Job({
          input: ["http://dailyjs.feed"],
          run: function() { this.exit("sorry"); }
        });
        self.JobStub = sinon.stub(nodeio, "Job", function() { return self.jobMock; });
      });

      afterEach(function() {
        nodeio.Job.restore();
      });

      it("should respond with `500`", function(done) {
        request(app)
          .post("/feeds")
          .send({ url: this.url })
          .set('Accept', 'application/json')
          .expect(500, done); // TODO err message verification
      });

    });
    
  });
  
});
