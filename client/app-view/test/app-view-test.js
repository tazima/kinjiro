
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone"),
    componentMock = require("tazima-component-mock");

var AppView = null;

describe("app-view", function() {

  before(function() {
    this.testBed = $([
      "<section id=\"content\">",
      "  <form class=\"new-subscribe\" action=\"#\" method=\"\">",
      "    <input type=\"text\" name=\"url\" />",
      "    <input type=\"submit\" value=\"add\" />",
      "  </form>",
      "  <div class=\"subscribe-list\"></div>",
      "</section>"
    ].join("")).appendTo("body");
    this.ListViewMock = sinon.spy(Backbone.View.extend());
    componentMock.registerMock("subscribe-list-view/index.js", this.ListViewMock);
    AppView = require("app-view");
  });

  after(function() {
    this.testBed.remove();
    componentMock.deregisterMock("subscribe-list-view/index.js");
  });

  beforeEach(function() {
    this.collection = new Backbone.Collection();
    this.collection.url = "/hoge";
    this.view = new AppView({ el: "#content", collection: this.collection });
  });

  afterEach(function() {
    this.ListViewMock.reset();
    $("#content").off();
  });

  describe("#render", function() {
    
    it("should render list view", function() {
      this.view.render();
      expect(this.ListViewMock.called).to.be.ok();
    });

    it("should instantiate ListView with .subscribe-list el", function() {
      this.view.render();
      expect(this.ListViewMock.called).to.be.ok();
      expect(this.ListViewMock.args[0][0].el.attr("class")).to.match(/subscribe-list/);
    });

    it("should instantiate ListView with collection", function() {
      this.view.render();
      expect(this.ListViewMock.args[0][0].collection).to.be(this.collection);
    });
  });

  describe("on `submit .new-subscribe`", function() {

    beforeEach(function() {
      this.createSpy = sinon.stub(this.collection, "create", function() {});
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