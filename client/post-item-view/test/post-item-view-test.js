
/**
 * Module dependencies.
 */

var $ = require("component-jquery"),
    Backbone = require("tazima-backbone"),
    PostItemView = require("post-item-view");

describe("post-item-view", function() {

  beforeEach(function() {
    this.model = new Backbone.Model({
      id: "http://hoge/1",
      title: "DailyJs",
      link: "http://hoge",
      description: "Hello, world.",
      pubdate: "Fri Jul 26 2013 17:08:00 GMT+0900 (JST)",
      unread: true
    });
    this.reads = new Backbone.Collection();
    this.reads.url = '/reads';
    this.view = new PostItemView({ model: this.model, reads: this.reads });
  });

  describe("#render()", function() {

    it("should render title", function() {
      this.view.render();
      expect(this.view.$(".title").text()).to.match(/DailyJs/);
    });

    it("should render link", function() {
      this.view.render();
      expect(this.view.$("a.link").attr("href")).to.match(/http\:\/\/hoge/);
    });

    it("should render description", function() {
      this.view.render();
      expect(this.view.$el.text()).to.match(/Hello, world/);
    });

    it("should render pubdate", function() {
      this.view.render();
      expect(this.view.$(".pubdate").text()).to.match(/2013-07-26/);
    });

    describe("when pubdate is null", function() {

      it("should not render pubdate but render view propery", function() {
        this.model.set('pubdate', null);
        this.view.render();
        expect($.trim(this.view.$(".pubdate").text())).to.be.empty();
      });

    });

  });

  describe('when `post.read` is triggered on el', function() {

    beforeEach(function() {
      this.readsCreateSpy = sinon.spy(this.reads, 'create');
    });

    afterEach(function() {
      this.reads.create.restore();
    });

    it('should mark el as `read`', function() {
      this.view.$el.trigger('post.read');
      expect(this.view.$el.hasClass('read')).to.be.ok();
    });

    it('should create new read', function() {
      this.view.$el.trigger('post.read');
      expect(this.readsCreateSpy.called).to.be.ok();
      expect(this.readsCreateSpy.args[0][0]).to.have.property('_id', this.model.id);
    });

  });

});
