
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    nock = require("nock"),
    sinon = require("sinon"),
    readFileSync = require("fs").readFileSync,
    Request = require("request").Request,
    feedRequest = require("../feed-request"),
    FeedRequest = require("../feed-request").FeedRequest;

var feedXml = readFileSync(__dirname + "/feed.xml");
var feedContainingHtml = readFileSync(__dirname + "/feed-url-contain.html");
var notFeedContainingHtml = readFileSync(__dirname + "/feed-url-not-contain.html");

describe("FeedRequest", function() {

  describe("constructor", function() {

    beforeEach(function() {
      sinon.stub(Request.prototype, "pipe", function() { return this; });
    });

    afterEach(function() {
      Request.prototype.pipe.restore();
    });

    it("should be an instance of `Readable` stream", function() {
      expect(new FeedRequest("http://google.com")).to.be.a(require("stream").Readable);
    });

  });

  beforeEach(function() {
    this.data = [];
    this.mockStream = new require("stream").Writable({ objectMode: true });
    this.mockStream._write = function(chunk, enc, next) {
      this.data.push(chunk);
      next();
    }.bind(this);
  });

  var shared = {
    shouldEmitMetaAndPushPosts: function() {

      it("should emit `meta` with meta data of fetched feed xml", function(done) {
        var spy = sinon.spy();

        new FeedRequest("http://feeds.feedburner.com/dailyjs")
          .on("meta", spy)
          .pipe(this.mockStream)
          .on("finish", function() {
            expect(spy.called).to.be.ok();
            // see sample-feed.xml
            expect(spy.args[0][0]).to.have.property("title", "DailyJS");
            done();
          }.bind(this));
      });

      it("should push post", function(done) {
        new FeedRequest("http://feeds.feedburner.com/dailyjs")
          .pipe(this.mockStream)
          .on("finish", function() {
            // see sample-feed.xml
            expect(this.data.map(function(datum) { return datum.guid; }))
              .to.eql([
                "http://dailyjs.com/2013/07/17/node-roundup",
                "http://dailyjs.com/2013/07/16/jquery-roundup",
                "http://dailyjs.com/2013/07/15/reddit-insight"
              ]);
            done();
          }.bind(this));
      });

    }
  };

  describe("when valid feed xml url is specified", function() {

    beforeEach(function() {
      this.scope = nock("http://feeds.feedburner.com/dailyjs")
        .get("/dailyjs")
        .reply(200, feedXml);
    });

    it("should request feed xml", function(done) {
      new FeedRequest("http://feeds.feedburner.com/dailyjs")
        .pipe(this.mockStream)
        .on("finish", function() {
          expect(this.scope.isDone()).to.be.ok();
          done();
        }.bind(this));
    });

    shared.shouldEmitMetaAndPushPosts();

  });

  describe("when html url that contains xml url link is specified", function() {

    beforeEach(function() {
      this.htmlScope = nock("http://dailyjs.com/")
        .get("/")
        .reply(200, feedContainingHtml);
      this.xmlScope = nock("http://feeds.feedburner.com/dailyjs")
        .get("/dailyjs")
        .reply(200, feedXml);
    });

    it("should request html", function(done) {
      new FeedRequest("http://dailyjs.com/")
        .pipe(this.mockStream)
        .on("finish", function() {
          expect(this.htmlScope.isDone()).to.be.ok();
          done();
        }.bind(this));
    });

    it("should request feed xml", function(done) {
      new FeedRequest("http://dailyjs.com/")
        .pipe(this.mockStream)
        .on("finish", function() {
          expect(this.xmlScope.isDone()).to.be.ok();
          done();
        }.bind(this));
    });

  });

  describe("when html url that dose not contain xml url link is specified", function() {

    beforeEach(function() {
      this.scope = nock("http://hoge.com/")
        .get("/")
        .reply(200, notFeedContainingHtml);
    });

    it("should request html", function(done) {
      var spy = sinon.spy(function() {
        expect(this.scope.isDone()).to.be.ok();
        done();
      }.bind(this));

      new FeedRequest("http://hoge.com/")
        .on("error", spy)
        .pipe(this.mockStream);
    });

    it("should emit `error`", function(done) {
      var spy = sinon.spy(function() {
        expect(spy.called).to.be.ok();
        done();
      });

      new FeedRequest("http://hoge.com/")
        .on("error", spy)
        .pipe(this.mockStream);
    });

  });

  describe(".isFeedLinkNode()", function() {

    it("should return true when node have rss url link", function() {
      var node = { name: "link", attributes: { type: { value: "application/rss+xml" } } };
      expect(feedRequest.isFeedLinkNode(node)).to.be.ok();
    });

    it("should return false when node dose not have name as `link`", function() {
      var node = {};
      expect(feedRequest.isFeedLinkNode(node)).to.not.be.ok();
    });

    it("should return false when node's attributes dose not have type", function() {
      var node = { name: "link", attributes: {} };
      expect(feedRequest.isFeedLinkNode(node)).to.not.be.ok();
    });

    it("should return false when node's type is not `application/rss+xml`", function() {
      var node = { name: "link", attributes: { type: { value: "text/html" } } };
      expect(feedRequest.isFeedLinkNode(node)).to.not.be.ok();
    });

  });

  describe(".resolve()", function() {

    it("should return absolute url", function() {
      expect(feedRequest.resolve("http://hoge.com", "/index"))
        .to.equal("http://hoge.com/index");
    });

  });

});
