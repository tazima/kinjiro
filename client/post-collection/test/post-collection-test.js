
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone"),
    PostCollection = require("post-collection");

describe("feed-collection", function() {

  beforeEach(function() {
    this.collection = new PostCollection([], { fid: "http://feeds.feedburner.com/dailyjs" });
  });

  describe("#url()",  function() {
    it("should return `/feeds/:fid/posts`", function() {
      expect(this.collection.url())
        .to.equal("/feeds/" +
                  encodeURIComponent("http://feeds.feedburner.com/dailyjs") +
                  "/posts");
    });
  });

});