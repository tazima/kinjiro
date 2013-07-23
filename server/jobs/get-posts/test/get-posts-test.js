
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    sinon = require("sinon"),
    nock = require("nock"),
    Request = require("request").Request,
    ObjectId = require("mongoose").Schema.ObjectId,
    Feed = require("../../../models/feed"),
    PostWritableStream = require("../post-writable-stream"),
    getPostsJob = require("../").job;

describe("get-posts", function() {

  beforeEach(function(done) {
    Feed.remove(done);
  });

  function beforeHour(from, hour) {
    return new Date(from.getTime() - hour * 60 * 60 * 1000);
  }

  describe("#input()", function() {

    beforeEach(function(done) {
      Feed.create([
        { title: "new one", xmlurl: "http://hoge", link: "http://hoge" },

        { title: "crawling now", xmlurl: "http://hoge",
          link: "http://hoge", crawlEnd: false, lastCrawlDate: new Date() },

        { title: "2 hour before", xmlurl: "http://hoge", link: "http://hoge",
          crawlEnd: true, lastCrawlDate: beforeHour(new Date(), 2) },

        { title: "30 min before", xmlurl: "http://hoge", link: "http://hoge",
          crawlEnd: true, lastCrawlDate: beforeHour(new Date(), 0.5) }
      ], done);
      getPostsJob.init();
    });

    it("should emit new feed", function(done) {
      getPostsJob.input(0, 0, function(feeds) {
        feeds = feeds.filter(function(feed) { return feed.title === "new one"; });
        expect(feeds).to.not.be.empty();
        done();
      }.bind(this));
    });

    it("should not emit feeds crawled within 1 hour", function(done) {
      getPostsJob.input(0, 0, function(feeds) {
        feeds = feeds.filter(function(feed) { return feed.title === "30 min before"; });
        expect(feeds).to.be.empty();
        done();
      });
    });

    it("should not emit feeds crawling now", function(done) {
      getPostsJob.input(0, 0, function(feeds) {
        feeds = feeds.filter(function(feed) { return feed.title === "crawling now"; });
        expect(feeds).to.be.empty();
        done();
      });
    })

    it("should emit feeds crawled before 1 hour", function(done) {
      getPostsJob.input(0, 0, function(feeds) {
        feeds = feeds.filter(function(feed) { return feed.title === "2 hour before"; });
        expect(feeds).to.not.be.empty();
        done();
      });
    });

  });

  describe("#run()", function() {

    beforeEach(function(done) {
      nock("http://hoge").get("/").reply(200);

      // stub Request#pipe to pipe to `finish` event.
      sinon.stub(Request.prototype, "pipe", function() {
        this.on = function(e, cb) {
          if (e === "finish") cb();
          return this;
        };
        return this;
      });

      sinon.stub(PostWritableStream.prototype, "getPostIds", function() {
        return [new ObjectId(), new ObjectId()];
      });

      this.feed = new Feed({
        title: "new one", xmlurl: "http://hoge", link: "http://hoge" });
      this.feed.save(done);
    });

    afterEach(function() {
      getPostsJob.emit.restore();
      Request.prototype.pipe.restore();
      PostWritableStream.prototype.getPostIds.restore();
    });

    it("should set crawlEnd as true", function(done) {
      sinon.stub(getPostsJob, "emit", function(feed) {
        expect(feed.crawlEnd).to.be.ok();
        done();
      });
      getPostsJob.run(this.feed);
    });

    it("should set lastCrawlDate as now", function(done) {
      sinon.stub(getPostsJob, "emit", function(feed) {
        var now = new Date();
        expect(feed.lastCrawlDate)
          .to.be.within(new Date(now.getTime() - 1000), new Date(now.getTime() + 1000));
        done();
      });
      getPostsJob.run(this.feed);
    });

  });

});