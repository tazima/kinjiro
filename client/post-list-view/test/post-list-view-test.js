
/**
 * Module dependencies.
 */

var $ = require('component-jquery'),
    Backbone = require('tazima-backbone'),
    ScrollPosition = require('timoxley-scroll-position'),
    PostListView = require('post-list-view'),
    PostItemView = require('post-item-view');

describe('post-list-view', function() {

  beforeEach(function() {
    this.collection = new Backbone.Collection();
    this.collection.url = '/foo';
    this.collectionFetchSpy =
      sinon.stub(this.collection, 'fetch', function() {
        this.reset([{ _id: 'post-1' }, { _id: 'post-2' }]);
      });
    this.itemViewInitializeSpy =
      sinon.spy(PostItemView.prototype, 'initialize');
    this.itemViewRenderSpy =
      sinon.stub(PostItemView.prototype, 'render', function() {
        return this;
      });
    // TODO liverage real function
    // in PhantomJs, function's bind is not supported and
    // real `bindScrollPosition` cannot be called.
    this.bindScrollPositionStub = sinon.stub(
      PostListView.prototype, "bindScrollPosition",
      function() {});
    this.reads = new Backbone.Collection();
    this.reads.url = '/reads';
    this.feed = new Backbone.Model({ title: "my title" });
    this.view = new PostListView({ collection: this.collection, 
                                   reads: this.reads, feed: this.feed });
  });

  afterEach(function() {
    this.collection.fetch.restore();
    PostItemView.prototype.initialize.restore();
    PostItemView.prototype.render.restore();
    PostListView.prototype.bindScrollPosition.restore();
  });

  describe('#initialize()', function() {

    it('should send `fetch` to collection', function() {
      expect(this.collectionFetchSpy.called).to.be.ok();
    });

    it('should bind itemViews to scroll event', function() {
      expect(this.bindScrollPositionStub.callCount).to.equal(2);
    });

    it('should render on `reset` event', function() {
      expect(this.view.$('ul')).to.not.be.empty();
    });

  });

  describe('#render()', function() {

    it('should render feed title', function() {
      expect(this.view.$('.title').text()).to.contain(this.feed.get('title'));
    });

    it('should create item view with model', function() {
      expect(this.itemViewInitializeSpy.callCount)
        .to.equal(this.collection.size());
      expect(this.itemViewInitializeSpy.args[0][0].model.get('_id'))
        .to.equal('post-1');
      expect(this.itemViewInitializeSpy.args[1][0].model.get('_id'))
        .to.equal('post-2');
    });

    it('should render item view', function() {
      expect(this.itemViewRenderSpy.callCount)
        .to.equal(this.collection.size());      
    });

  });

  describe('`post.read` event', function() {

    describe('when scrolled into an el', function() {

      it('should trigger `post.read` event on scrolled into the el', function() {
        // TODO emit real scroll event
        var item = this.view.$('li:nth-child(2)'),
            spy = sinon.spy();

        item.on('post.read', spy);
        this.view.triggerRead(item.get(0));

        expect(spy.called).to.be.ok();
      });

    });

  });

  describe('#next()', function() {

    it('should fetch with page count', function() {
      this.view.next();
      expect(this.collectionFetchSpy.lastCall.args[0].data)
        .to.have.property('page', 2);
    });

  });

});
