
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
      "  <form class=\"subscribe\" action=\"#\" method=\"\">",
      "    <input type=\"text\" name=\"url\" />",
      "    <input type=\"submit\" value=\"add\" />",
      "  </form>",
      "  <div class=\"feed-list\"></div>",
      "</section>"
    ].join("")).appendTo("body");
    this.FeedListViewMock = sinon.spy(Backbone.View.extend());
    componentMock.registerMock("feed-list-view/index.js", this.FeedListViewMock);
    AppView = require("app-view");
  });

  after(function() {
    this.testBed.remove();
    componentMock.deregisterMock("feed-list-view/index.js");
  });

  beforeEach(function() {
    this.collection = new Backbone.Collection();
    this.collection.url = "/hoge";
    this.view = new AppView({ el: "#content", collection: this.collection });
  });

  afterEach(function() {
    this.FeedListViewMock.reset();
    $("#content").off();
  });

  describe("#render", function() {
    
    it("should render list view", function() {
      this.view.render();
      expect(this.FeedListViewMock.called).to.be.ok();
    });

    it("should instantiate ListView with .feed-list el", function() {
      this.view.render();
      expect(this.FeedListViewMock.called).to.be.ok();
      expect(this.FeedListViewMock.args[0][0].el.attr("class")).to.match(/feed-list/);
    });

    it("should instantiate ListView with collection", function() {
      this.view.render();
      expect(this.FeedListViewMock.args[0][0].collection).to.be(this.collection);
    });
  });

  describe("on `submit .subscribe`", function() {

    beforeEach(function() {
      this.createSpy = sinon.stub(this.collection, "create", function(data, opts) {
        opts.success({ id: "http://hoge.com/rss" });
        this.trigger("add");
      });
      this.navigateSpy = sinon.spy(Backbone.history, "navigate");
    });

    afterEach(function() {
      this.collection.create.restore();
      Backbone.history.navigate.restore();
    });

    it("should create new FeedModel", function() {
      this.view.render();
      this.view.$(".subscribe [type=text]").val("http://hoge.com");
      this.view.$(".subscribe").submit();

      expect(this.createSpy.called).to.be.ok();
      expect(this.createSpy.args[0][0])
        .to.have.property("url", "http://hoge.com");
    });

    it("should navigate to created feed's posts route", function(done) {
      var self = this;

      this.collection.on("add", function() {
        expect(self.navigateSpy.args[0][0])
          .to.match(/feeds\/http%3A%2F%2Fhoge.com%2Frss\/posts/);
        expect(self.navigateSpy.args[0][1]).to.have.property("trigger", true);
        done();
      });

      this.view.render();
      this.view.$(".subscribe [type=text]").val("http://hoge.com");
      this.view.$(".subscribe").submit();
    });

  });

});
