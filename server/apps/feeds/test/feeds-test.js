
/**
 * Module dependencies.
 */

var express = require("express"),
    expect = require("expect.js"),
    async = require("async"),
    request = require("supertest"),
    sinon = require("sinon"),
    knit = require("knit"),
    EventEmitter = require("events").EventEmitter,
    Feed = require("../../../models/feed"),
    Post = require("../../../models/post"),
    User = require("../../../models/user"),
    setup = require("../../../test/setup"),
    FeedRequest = require("../feed-request").FeedRequest,
    feed = require("../");

var app = express();

var fixture = require("./fixture");
var postFixture = require("./post-fixture");

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
          self.user.subscribes.push.apply(
            self.user.subscribes,
            feeds.map(function(feed) { return { _feed: feed._id }; })
          );
          self.user._read_posts.push("http://rssfeed.com/1");
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
    
    it("should respond users' `subscribes`", function(done) {
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

    describe("when fetching feed fail", function() {

      before(function() {
        this.feedRequestSpy = sinon.spy(function(url) {
          var mock = Object.create(EventEmitter.prototype);
          mock.pipe = function(dst) {
            process.nextTick(mock.emit.bind(this, "error", new Error()));
            process.nextTick(dst.end.bind(dst));
            return dst;
          };
          return mock;
        });

        // inject mock
        knit.config(function(bind) {
          bind("feedRequest").to(this.feedRequestSpy);
        }.bind(this));
      });

      beforeEach(function() {
        this.saveSpy = sinon.spy(Feed.prototype, "save");
      });

      afterEach(function() {
        Feed.prototype.save.restore();
      });

      after(function() {
        require("../module")();
      });

      it("should respond with 500", function(done) {
        request(app)
          .post("/feeds")
          .send({ url: "http://feedurl.xml" })
          .expect(500, done);
      });

    });

    describe("when feed fetched", function() {

      beforeEach(function() {
        var self = this;

        this.feedRequestSpy = sinon.spy(function(url) {
          var mock = Object.create(EventEmitter.prototype);
          mock.pipe = function(dst) {
            self.feedRequestPipeDst = dst;
            mock.emit("meta", { title: "DailyJS", link: "http://dailjy.com" });
            dst.write(postFixture[0]);
            dst.write(postFixture[1]);
            process.nextTick(dst.end.bind(dst));
            return dst;
          };
          return mock;
        });

        // inject mock
        knit.config(function(bind) {
          bind("feedRequest").to(this.feedRequestSpy);
        }.bind(this));
      });

      afterEach(function() {
        require("../module")();
      });

      it("should request feed xml", function(done) {
        request(app)
          .post("/feeds")
          .send({ url: "http://feedurl.xml" })
          .expect(200)
          .end(function(err, res) {
            expect(this.feedRequestSpy.called).to.be.ok();
            done();
          }.bind(this));
      });

      describe("save feed", function() {

        beforeEach(function() {
          this.saveSpy = sinon.spy(Feed.prototype, "save");
        });

        afterEach(function() {
          Feed.prototype.save.restore();
        });

        it("should save fetched meta data", function(done) {
          request(app)
            .post("/feeds")
            .send({ url: "http://feedurl.xml" })
            .expect(200)
            .end(function(err, res) {
              expect(this.saveSpy.called).to.be.ok();
              done();
            }.bind(this));
        });

        it("should save fetched posts ids", function(done) {
          request(app)
            .post("/feeds")
            .send({ url: "http://feedurl.xml" })
            .expect(200)
            .end(function(err, res) {
              var actual = this.saveSpy.thisValues[0]._feed_posts
                    .map(function(id) { return id.toString(); });
              expect(actual).to.eql(["http://feedurl/1", "http://feedurl/2"]);
              done();
            }.bind(this));
        });

      });

      describe("save posts", function() {

        beforeEach(function() {
          var ws = this.ws = new require("stream").Writable({ objectMode: true });
          ws._write = function(chunk, enc, next) { next(); };
          ws.getPostIds = function() { return []; };
          sinon.stub(Post, "createWriteStream", function() { return ws; });
        });

        afterEach(function() {
          Post.createWriteStream.restore();
        });

        it("should pipe `feedRequest` to Post's writable stream", function(done) {
          request(app)
            .post("/feeds")
            .send({ url: "http://feedurl.xml" })
            .expect(200)
            .end(function(err, res) {
              expect(this.feedRequestPipeDst).to.be(this.ws);
              done();
            }.bind(this));
        });

      });

      describe("save user", function() {

        beforeEach(function() {
          this.saveSpy = sinon.spy(User.prototype, "save");
        });

        afterEach(function() {
          User.prototype.save.restore();
        });

        it("should append fetched feed id to subscribes", function(done) {
          request(app)
            .post("/feeds")
            .send({ url: "http://feedurl.xml" })
            .expect(200)
            .end(function(err, res) {
              expect(this.saveSpy.called).to.be.ok();
              var feeds = this.saveSpy.thisValues[0].subscribes
                    .map(function(subscribe) { return subscribe._feed; });
              expect(feeds).to.contain("http://feedurl.xml");
              done();
            }.bind(this));
        });

      });

    });

    // TODO test for `correcturl`

  });
  
});
