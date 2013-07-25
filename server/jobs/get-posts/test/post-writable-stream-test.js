
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    ObjectId = require("mongoose").Types.ObjectId,
    Post = require("../../../models/post"),
    PostWritableStream = require("../post-writable-stream");

describe("PostWritableStream", function() {

  it("should inherits from stream.Writable", function() {
    expect(new PostWritableStream()).to.be.a(require("stream").Writable);
  });

  describe("write", function() {

    beforeEach(function(done) {
      Post.remove(done);
      this.feedId = new ObjectId();
      this.ws = new PostWritableStream(this.feedId, { objectMode: true });
      this.article = {
        guid: "http://hoge",
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
          var feedId = doc._feed;
          expect(feedId.toString()).to.equal(self.feedId.toString());
          done();
        });
      });
    });

    it("should create article document", function(done) {
      var self = this;
      self.ws.write(self.article, function() {
        Post.findOne({ _id: self.article.guid }, function(err, doc) {
          expect(doc).to.have.property("title", self.article.title);
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

