
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone"),
    componentMock = require("tazima-component-mock");

var SubscribeListView = null;

describe("subscribe-item-view", function() {

  beforeEach(function() {
    this.ItemViewMock = sinon.spy(Backbone.View.extend());
    componentMock.registerMock("subscribe-item-view/index.js", this.ItemViewMock);
    this.collection = new Backbone.Collection([
      { name: "hoge", url: "piyo" }
    ]);
    this.collection.url = "/piyo";
    SubscribeListView = require("subscribe-list-view");
    this.view = new SubscribeListView({ collection: this.collection });
  });

  afterEach(function() {
    componentMock.deregisterMock("subscribe-item-view/index.js");
  });

  describe("#render", function() {

    it("should render item view", function() {
      this.view.render();
      expect(this.ItemViewMock.called).to.be.ok();
    });

  });

  describe("on `submit .new-subscribe`", function() {

    beforeEach(function() {
      this.createSpy = sinon.stub(this.collection, "create", function() {
      });
    });

    afterEach(function() {
      this.collection.create.restore();
    });

    it("should create new SubscribeModel", function() {
      this.view.render();
      this.view.$(".new-subscribe [type=text]").val("hoge");
      this.view.$(".new-subscribe").submit();

      expect(this.createSpy.called).to.be.ok();
      expect(this.createSpy.args[0][0])
        .to.have.property("url", "hoge");
    });

  });

});