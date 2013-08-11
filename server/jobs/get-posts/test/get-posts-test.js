
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    expect = require("expect.js"),
    sinon = require("sinon"),
    nock = require("nock"),
    Request = require("request").Request,
    ObjectId = require("mongoose").Types.ObjectId,
    Feed = require("../../../models/feed"),
    Post = require("../../../models/post"),
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
        { title: "new one", xmlurl: "http://hoge", link: "http://hoge",
          crawlEnd: false, lastCrawlDate: null},

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
    });

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
      // stub response to feed.xmlurl request
      nock("http://hoge").get("/").reply(200);

      // stub Request#pipe to pipe to `finish` event.
      sinon.stub(Request.prototype, "pipe", function() {
        this.on = function(e, cb) {
          if (e === "finish") { cb(); }
          return this;
        };
        return this;
      });

      var self = this;
      this.alreadyStoredPostId = new ObjectId();
      this.newPostIds = [new ObjectId(), new ObjectId(), this.alreadyStoredPostId];

      sinon.stub(Post, "createWriteStream", function() {
        return {
          getPostIds: function() {
            return self.newPostIds;
          }
        };
      });

      this.feed = new Feed({
        _id: "http://hoge", title: "new one", link: "http://hoge",
        _feed_posts: [this.alreadyStoredPostId] });
      this.feed.save(done);
    });

    afterEach(function() {
      getPostsJob.emit.restore();
      Request.prototype.pipe.restore();
      Post.createWriteStream.restore();
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

    it("should merge `_feed_post_ids", function(done) {
      var expectedIds = this.newPostIds.slice(0);
      expectedIds.unshift(this.alreadyStoredPostId);
      expectedIds = _.uniq(expectedIds.map(function(p) { return p.toString(); }));
      sinon.stub(getPostsJob, "emit", function(feed) {
        var feedPosts = feed._feed_posts.map(function(p) { return p.toString(); });
        expect(feedPosts).to.eql(expectedIds);
        done();
      });
      getPostsJob.run(this.feed);
    });

  });

});
