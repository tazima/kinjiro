
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone"),
    componentMock = require("tazima-component-mock");

var FeedListView = null;

describe("feed-item-view", function() {

  before(function() {
    this.ItemViewMock = sinon.spy(Backbone.View.extend());
    componentMock.registerMock("feed-item-view/index.js", this.ItemViewMock);
  });

  afterEach(function() {
    componentMock.deregisterMock("feed-item-view/index.js");
  });

  beforeEach(function() {
    this.collection = new Backbone.Collection([
      { name: "hoge", url: "piyo" }
    ]);
    this.collection.url = "/piyo";
    FeedListView = require("feed-list-view");
    this.view = new FeedListView({ collection: this.collection });
  });

  afterEach(function() {
    this.ItemViewMock.reset();
  });

  describe("#render", function() {

    it("should render item view", function() {
      this.view.render();
      expect(this.ItemViewMock.called).to.be.ok();
    });

  });

});