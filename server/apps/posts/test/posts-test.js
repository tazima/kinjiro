
/**
 * Module dependencies.
 */

var express = require("express"),
    async = require("async"),
    request = require("supertest"),
    expect = require("expect.js"),
    posts = require("../"),
    setup = require("../../../test/setup"),
    User = require("../../../models/user"),
    Post = require("../../../models/post"),
    Feed = require("../../../models/feed");

var app = express();

var feedFixture = require("../../../test/fixtures/feed");
var postFixture = require("../../../test/fixtures/post");
var userFixture = require("../../../test/fixtures/user");

describe("posts", function() {

  var feedIds = [];

  beforeEach(function(done) {
    var self = this;

    // fake user_id
    app.use(function(req, res, next) {
      req.session = {};
      req.session.user_id = self.user._id;
      next();
    });
    app.use(posts);

    async.series([
      function(cb) { setup(cb); },
      function(cb) { Feed.create(feedFixture, cb); },
      function(cb) { Post.create(postFixture, cb); },
      function(cb) {
        User.create(userFixture, function(err, user) {
          self.user = user;
          cb(err);
        });
      }
    ], done);
  });

  describe("GET /feeds/:fid/posts", function() {

    describe("when user has feeds of fid", function() {

      it("should respond with posts of fid", function(done) {
        request(app)
          .get("/feeds/" + encodeURIComponent(postFixture[0]._feed) + "/posts")
          .expect(200)
          .end(function(err, res) {
            var actual = res.body[0],
                expected = postFixture[0];
            expect(actual).to.have.property("_feed", expected._feed);
            expect(actual).to.have.property("_id", expected._id);
            expect(actual).to.have.property("title", expected.title);
            expect(actual).to.have.property("description", expected.description);
            done(err);
          });
      });

      it("should mark unread true for unread posts", function(done) {
        request(app)
          .get("/feeds/" + encodeURIComponent(postFixture[0]._feed) + "/posts")
          .expect(200)
          .end(function(err, res) {
            var unreads = res.body.filter(function(post) { return post.unread; });
            // see post-fixture
            expect(unreads).to.have.length(4);
            expect(unreads[0]._id).to.equal("http://dailyjs.com/2013/08/19/hoge2");
            done();
          });
      });

      it("should be sorted by pubdate desc", function(done) {
        request(app)
          .get("/feeds/" + encodeURIComponent(postFixture[0]._feed) + "/posts")
          .expect(200)
          .end(function(err, res) {
            var posts = res.body, i, j, l;
            for (i = 0, j = 1, l = posts.length; j < l; i++, j++) {
              expect(posts[i].pubdate).greaterThan(posts[j].pubdate);
            }
            done();
          });
      });

    });

    describe("paging", function() {

      it("should respond with specified page posts", function(done) {
        posts.setMaxCount(2);
        request(app)
          .get("/feeds/" + encodeURIComponent(postFixture[2]._feed) + "/posts?page=2")
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.length(2);
            expect(res.body.map(function(p) { return p._id; }))
              .to.eql(postFixture.slice(2, 4).map(function(p) { return p._id; }));
            done(err);
          });
      });

    });

    describe("when user dosen't have feeds of fid", function() {

      it("should return 404", function(done) {
        request(app)
          .get("/feeds/not-exists-fid/posts")
          .expect(404, done);
      });

    });

  });

});
