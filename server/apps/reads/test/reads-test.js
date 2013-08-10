
/**
 * Module dependencies.
 */

var express = require('express'),
    expect = require('expect.js'),
    async = require('async'),
    request = require('supertest'),
    Post = require('../../../models/post'),
    User = require('../../../models/user'),
    setup = require('../../../test/setup'),
    reads = require('../');

var app = express();

// fixtures

var postFixture = require('../../../test/fixtures/post');
var userFixture = require('../../../test/fixtures/user');

describe('reads', function() {

  beforeEach(function(done) {
    var self = this;

    // fake user_id
    app.use(function(req, res, next) {
      req.session = {};
      req.session.user_id = self.user._id;
      next();
    });

    app.use(reads);

    async.series([
      function(cb) { setup(cb); },
      function(cb) { Post.create(postFixture, cb); },
      function(cb) {
        User.create(userFixture, function(err, user) {
          self.user = user;
          cb(err);
        });
      }
    ], done);
  });

  describe('POST /reads', function() {

    it('should add passed post id to user\'s read_ posts', function(done) {
      request(app)
        .post('/reads')
        .send({ _id: postFixture[1]._id, _feed: postFixture[1]._feed })
        .expect(200)
        .end(function(err, res) {
          User.findOne({ name: userFixture.name }, function(err, user) {
            expect(user._read_posts).to.contain(postFixture[1]._id);
            done();
          });
        });
    });

    it('should decrement unread count of user\'s subscribe of passed post id', function(done) {
      function filter(s) {
        return s._feed === postFixture[1]._feed;
      }

      var oldCount = this.user.subscribes.filter(filter)[0].unread_count;

      request(app)
        .post('/reads')
        .send({ _id: postFixture[1]._id, _feed: postFixture[1]._feed })
        .expect(200)
        .end(function(err, res) {
          User.findOne({ name: userFixture.name }, function(err, user) {
            var subscribe = user.subscribes.filter(filter);
            expect(subscribe[0].unread_count).to.equal(oldCount - 1);
            done();
          });
        });
    });

  });

});
