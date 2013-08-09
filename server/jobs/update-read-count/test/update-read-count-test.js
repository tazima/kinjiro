
/**
 * Module dependencies.
 */

var expect = require('expect.js'),
    sinon = require('sinon'),
    async = require('async'),
    setup = require('../../../test/setup'),
    User = require('../../../models/user'),
    Post = require('../../../models/post'),
    updateReadCountJob = require('../').job;

// fixtures
var userFixture = require('./user-fixture');
var postFixture = require('./post-fixture');

describe('update-read-count', function() {

  beforeEach(function(done) {
    updateReadCountJob.init();
    async.series([
      function(cb) { setup(cb); },
      function(cb) { User.create(userFixture, cb); },
      function(cb) { Post.create(postFixture, cb); }
    ], done);
  });

  describe('#input()', function() {

    it('should return all users', function(done) {
      updateReadCountJob.input(0, 0, function(users) {
        expect(users).to.have.length(userFixture.length);
        expect(users[0]).to.have.property('name', userFixture[0].name);
        done();
      });
    });

  });

  describe('#run()', function() {

    beforeEach(function(done) {
      User.findOne({ name: userFixture[0].name }, function(err, user) {
        if (err) { throw err; }
        this.user = user;
        done();
      }.bind(this));
    });

    afterEach(function() {
      updateReadCountJob.emit.restore();
    });

    it('should update unread count of subscribes of user', function(done) {
      sinon.stub(updateReadCountJob, 'emit', function() {
        User.findOne({ name: userFixture[0].name }, function(err, user) {
          expect(err).to.be(null);

          var first = user.subscribes.filter(function(f) { return (/first/).test(f._feed); }),
              second = user.subscribes.filter(function(f) { return (/second/).test(f._feed); });

          expect(first[0].unread_count).to.equal(1); // see post-fixture.json
          expect(second[0].unread_count).to.equal(2);
          done();
        });
      });

      updateReadCountJob.run(this.user);
    });

  });

});
