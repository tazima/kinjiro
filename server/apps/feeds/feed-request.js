
/**
 * Module dependencies.
 */

var util = require('util'),
    url = require('url'),
    request = require('request'),
    FeedParser = require('feedparser');

/**
 * Expose `feedRequest`.
 */

exports = module.exports = feedRequest;

/**
 * Expose `FeedRequest`.
 */

exports.FeedRequest = FeedRequest;

/**
 * Expose helper apis.
 */

exports.isFeedLinkNode = isFeedLinkNode;
exports.resolve = resolve;

/**
 * Create a new `FeedRequest`.
 *
 * @param {String} url
 * @return {FeedRequest}
 * @api public
 */

function feedRequest(url) {
  return new FeedRequest(url);
}

/**
 * Constructor
 *
 * @param {String} url
 */

function FeedRequest(url) {
  FeedRequest.super_.call(this);
  this._readableState.objectMode = true;
  this.url = url;
  this.feed = null;
  this.init = false;
  this.feedLinkNodes = [];
  this.parser = request(this.url).pipe(new FeedParser({ strict: false }));
}

/**
 * Inherits from `Readable`.
 */

util.inherits(FeedRequest, require('stream').Readable);

/**
 * @Override
 */

FeedRequest.prototype._read = function() {
  if (this.init) { return; }
  this.init = true;

  // retry on first `error`
  this.parser.on("error", this.retry.bind(this));
  this.parser.on("meta", this.emit.bind(this, "meta"));
  this.parser.on("end", this.handleEnd.bind(this));
  this.parser.on("readable", function() {
    // start reading from parser on first `readable`
    this.push(this.parser.read());
  }.bind(this));

  // register `opentag` listener of parser's stream
  // to collect link node that have xml feed url
  this.parser.stream.on("opentag", this.collectFeedLinkNode.bind(this));
};

/**
 * Search rss xml url from parsed node
 * then retry to get rss feed by the url.
 *
 * @api private
 */

FeedRequest.prototype.retry = function() {
  if (this.feedLinkNodes.length === 0) { return this.emit("error", "url not found"); }

  this.url = resolve(this.url, this.feedLinkNodes[0].attributes.href.value);
  this.emit("correcturl", this.url);

  // reset parser
  this.parser.removeAllListeners();
  delete this.parser;
  this.parser = request(this.url).pipe(new FeedParser());
  this.parser.on("meta", this.emit.bind(this, "meta"));
  this.parser.on("error", this.emit.bind(this, "error"));
  this.parser.on("end", this.handleEnd.bind(this));
  this.parser.on("readable", function() {
    this.push(this.parser.read());
  }.bind(this));
};

/**
 * Handle `end` event of parser.
 *
 * @api private
 */

FeedRequest.prototype.handleEnd = function() {
  this.push(null);
};

/**
 * Collect feed link node.
 *
 * @param {Object} node
 * @api private
 */

FeedRequest.prototype.collectFeedLinkNode = function(node) {
  if (isFeedLinkNode(node)) { this.feedLinkNodes.push(node); }
};

/**
 * Check that node is feed link node.
 *
 * @param {Object} node
 * @return {boolean}
 * @api public
 */

function isFeedLinkNode(node) {
  return node.name === "link" &&
    node.attributes.type &&
    /application\/rss\+xml/.test(node.attributes.type.value);
}

/**
 * Resolve `to` if `to` is absolute url.
 *
 * @param {String} from
 * @param {String} to
 * @return {String}
 * @api public
 */

function resolve(from, to) {
  // return if to is not absolute path
  if (!to.match(/^\/.*/)) { return to; }
  return url.resolve(from, to);
}
