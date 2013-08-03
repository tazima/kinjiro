
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    sinon = require("sinon"),
    async = require("async"),
    ObjectId = require("mongoose").Types.ObjectId,
    setup = require("../../test/setup"),
    Post = require("../post");

var MONGO_CONN_STRING = "mongodb://localhost:27017/kinjiro-test";

describe("Post", function() {

  beforeEach(function(done) {
    setup(done);
  });

  describe("#save()", function() {

    beforeEach(function(done) {
      this.feed = new Post({
        _id: "http://dailyjs.com/2013/07/31/node-roundup",
        _feed: "http://feeds.feedburner.com/dailyjs",
        title: "Node Roundup: 0.10.15",
        description: "my description",
        summary: "my summary",
        pubdate: "2013-07-31T00:00:00+01:00"
      });
      Post.remove(done);
    });

    it("should save `_id`", function(done) {
      this.feed.save(function(err, doc) {
        expect(doc._id).to.equal("http://dailyjs.com/2013/07/31/node-roundup");
        done(err);
      });
    });

    it("should save `_feed`", function(done) {
      this.feed.save(function(err, doc) {
        expect(doc._feed).to.equal("http://feeds.feedburner.com/dailyjs");
        done(err);
      });
    });

    it("should save `title`", function(done) {
      this.feed.save(function(err, doc) {
        expect(doc.title).to.equal("Node Roundup: 0.10.15");
        done(err);
      });
    });

    it("should save `description`", function(done) {
      this.feed.save(function(err, doc) {
        expect(doc.description).to.equal("my description");
        done(err);
      });
    });

    it("should save `summary`", function(done) {
      this.feed.save(function(err, doc) {
        expect(doc.summary).to.equal("my summary");
        done(err);
      });
    });

    it("should save `pubdate`", function(done) {
      this.feed.save(function(err, doc) {
        expect(doc.pubdate).to.equal("2013-07-31T00:00:00+01:00");
        done(err);
      });
    });

  });

  describe(".createWriteStream()", function() {

    it("should inherits from stream.Writable", function() {
      expect(Post.createWriteStream("hoge")).to.be.a(require("stream").Writable);
    });

    describe("#write()", function() {

      beforeEach(function(done) {
        Post.remove(done);
        this.feedurl = "http://slashdot.jp/slashdotjp.rss";
        this.ws = Post.createWriteStream(this.feedurl);
        this.article = {
          guid: "http://hoge",
          link: "http://hoge",
          title: "my title",
          description: "my description",
          summary: "my summary",
          image: {
            url: "http://pyo",
            title: "my image"
          }
        };
      });

      it("should save _feed as specified feed id", function(done) {
        var self = this;
        self.ws.write(self.article, function() {
          Post.findOne({ _id: self.article.guid }, function(err, doc) {
            var feedurl = doc._feed;
            expect(feedurl).to.equal(self.feedurl);
            done();
          });
        });
      });

      it("should create article document", function(done) {
        var self = this;
        self.ws.write(self.article, function() {
          Post.findOne({ _id: self.article.guid }, function(err, doc) {
            expect(doc).to.have.property("title", self.article.title);
            expect(doc).to.have.property("link", self.article.link);
            expect(doc).to.have.property("description", self.article.description);
            expect(doc).to.have.property("summary", self.article.summary);
            expect(doc).to.have.property("imageUrl", self.article.image.url);
            expect(doc).to.have.property("imageTitle", self.article.image.title);
            done();
          });
        });
      });

    });

  });

});
