
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone");

var SubscribeListView = null;

describe("subscribe-item-view", function() {

  // TODO extract component-moch

  var originalMockMap = {};

  /**
   * register mock
   * @param {String} moduleName
   * @param {Object} mock
   */

  function registerMock(moduleName, mock) {
    originalMockMap[moduleName] = require.modules[moduleName];
    require.register(moduleName, function(exports, require, module) {
      module.exports = mock;
    });
  }

  /**
   * deregister mock
   * @param {String} moduleName
   */

  function deregisterMock(moduleName) {
    require.register(moduleName, originalMockMap[moduleName]);
  }

  beforeEach(function() {
    this.ItemViewMock = sinon.spy(Backbone.View.extend());
    registerMock("subscribe-item-view/index.js", this.ItemViewMock);
    this.collection = new Backbone.Collection([
      { name: "hoge", url: "piyo" }
    ]);
    this.collection.url = "/piyo";
    SubscribeListView = require("subscribe-list-view");
    this.view = new SubscribeListView({ collection: this.collection });
  });

  afterEach(function() {
    deregisterMock("subscribe-item-view/index.js");
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