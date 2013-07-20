
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone"),
    PostListView = require("post-list-view"),
    PostItemView = require("post-item-view");

describe("post-list-view", function() {

  beforeEach(function() {
    this.collection = new Backbone.Collection;
    this.collection.url = "/foo";
    this.collectionFetchSpy =
      sinon.stub(this.collection, "fetch", function() {
        this.reset([{ _id: "post-1" }, { _id: "post-2" }]);
      });
    this.itemViewInitializeSpy =
      sinon.spy(PostItemView.prototype, "initialize");
    this.itemViewRenderSpy =
      sinon.stub(PostItemView.prototype, "render", function() {
        return this;
      });
    this.view = new PostListView({ collection: this.collection });
  });

  afterEach(function() {
    this.collection.fetch.restore();
    PostItemView.prototype.initialize.restore();
    PostItemView.prototype.render.restore();
  });

  describe("#initialize()", function() {

    it("should send `fetch` to collection", function() {
      expect(this.collectionFetchSpy.called).to.be.ok();
    });

    it("should render on  `reset` event", function() {
      expect(this.view.$("ul")).to.not.be.empty();      
    });

  });

  describe("#render()", function() {

    it("should create item view with model", function() {
      expect(this.itemViewInitializeSpy.callCount)
        .to.equal(this.collection.size());
      expect(this.itemViewInitializeSpy.args[0][0].model.get("_id"))
        .to.equal("post-1");
      expect(this.itemViewInitializeSpy.args[1][0].model.get("_id"))
        .to.equal("post-2");
    });

    it("should render item view", function() {
      expect(this.itemViewRenderSpy.callCount)
        .to.equal(this.collection.size());      
    });

  });

});