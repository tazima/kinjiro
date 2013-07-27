
/**
 * Module dependencies.
 */

var expect = require("expect.js"),
    nock = require("nock"),
    readFileSync = require("fs").readFileSync,
    getFeedMetaData = require("../");

var feedXml = readFileSync(__dirname + "/sample-feed.xml");
var feedUrlContainHtml = readFileSync(__dirname + "/sample-feed-url-contain.html");
var feedUrlNotContainHtml = readFileSync(__dirname + "/sample-feed-url-not-contain.html");

describe("get-feed-meta-data", function() {

  describe("with valid feed url", function() {

    beforeEach(function() {
      this.validUrl = "http://feeds.feedburner.com/dailyjs";
      this.scope = nock(this.validUrl)
        .get("/dailyjs")
        .reply(200, feedXml);
    });

    it("should request to feed url", function(done) {
      getFeedMetaData(this.validUrl, function(err, meta) {
        expect(this.scope.isDone()).to.be.ok();
        done(err);
      }.bind(this));
    });

    it("should get feed meta data", function(done) {
      getFeedMetaData(this.validUrl, function(err, meta) {
        expect(meta[0].title).to.equal("DailyJS"); // from sample-feed.xml
        done(err);
      }.bind(this));
    });

  });

  describe("with invalid feed url", function() {

    describe("when scraped html contains feed url", function() {

      beforeEach(function() {
        this.invalidUrl = "http://dailyjs.com/";
        this.validUrl = "http://feeds.feedburner.com/dailyjs";
        this.invalidUrlScope = nock(this.invalidUrl)
          .get("/")
          .twice()
          .reply(200, feedUrlContainHtml);
        this.validUrlScope = nock(this.validUrl);
        this.scope = nock(this.validUrl)
          .get("/dailyjs")
          .reply(200, feedXml);
      });

      it("should request twice to specified url", function(done) {
        getFeedMetaData(this.invalidUrl, function(err, meta) {
          expect(this.invalidUrlScope.isDone()).to.be.ok();
          done(err);
        }.bind(this));
      });

      it("should request to feed url", function(done) {
        getFeedMetaData(this.validUrl, function(err, meta) {
          expect(this.validUrlScope.isDone()).to.be.ok();
          done(err);
        }.bind(this));
      });

      it("should get feed meta data", function(done) {
        getFeedMetaData(this.validUrl, function(err, meta) {
          expect(meta[0].title).to.equal("DailyJS"); // from sample-feed.xml
          done(err);
        }.bind(this));
      });

    });

    describe("when scraped html dose not have feed url", function() {

      beforeEach(function() {
        this.invalidUrl = "http://hoge";
        this.scope = nock(this.invalidUrl)
          .get("/")
          .twice()
          .reply(200, feedUrlNotContainHtml);
      });

      it("should exit job with err", function(done) {
        getFeedMetaData(this.invalidUrl, function(err, meta) {
          expect(err).to.not.be(null);
          done();
        }.bind(this));
      });

    });

  });

});
