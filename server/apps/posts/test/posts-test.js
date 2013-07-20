
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

var feedFixture = require("../../feeds/test/fixture");
var postFixture = require("./post-fixture");

describe("posts", function() {

  var feedIds = [];

  before(function(done) {
    var self = this;

    async.waterfall([
      function(cb) { User.remove(cb); },
      function(user, cb) { Feed.remove(cb); },
      function(user, cb) { Post.remove(cb); },
      function(feed, cb) { Feed.create(feedFixture, cb); },
      function() {
        var args = [].slice.call(arguments),
            cb = args.pop();
        feedIds = args.map(function(feed) { return feed._id; });
        cb(null);
      },
      function(cb) {
        self.user = new User({ name: "a", password: "b" });
        self.user._subscribes.push.apply(self.user._subscribes, feedIds);
        self.user.save(cb);
      },
      function(user, numberAffected, cb) {
        Post.create(postFixture(feedIds[0]), cb);
      },
      function(post, cb) {
        Feed.findOne({ _id: post._feed }, function(err, feed) {
          feed._feed_posts.push(post._id);
          feed.save(cb);
        });
      }
    ], function(err, resu) {
      // fake user_id
      app.use(function(req, res, next) {
        req.session = {};
        req.session.user_id = self.user._id;
        next();
      });
      app.use(posts);
      setup(done);
    });
  });

  describe("GET /feeds/:fid/posts", function() {

    describe("when user has feeds of fid", function() {

      it("should respond with posts of fid", function(done) {
        request(app)
          .get("/feeds/" + feedIds[0] + "/posts")
          .expect(200)
          .end(function(err, res) {
            var actual = res.body[0],
                expected = postFixture(feedIds[0]);
            expect(actual).to.have.property("_feed", expected._feed);
            expect(actual).to.have.property("_id", expected._id);
            expect(actual).to.have.property("title", expected.title);
            expect(actual).to.have.property("description", expected.description);
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
