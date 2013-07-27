
/**
 * Module dependencies.
 */

var Post = require("../../models/post");

/**
 * Expose `PostWritableStream`.
 */

exports = module.exports = PostWritableStream;

/**
 * Constructor.
 *
 * @param {ObjectId} feedId
 * @param {Object} options
 */

function PostWritableStream(feedId, options) {
  PostWritableStream.super_.call(this, options);
  this.postIds = [];
  this.feedId = feedId;
}

/**
 * Inherits from stream.Writable.
 */

require("util").inherits(PostWritableStream, require("stream").Writable);

/**
 * @Override
 */

PostWritableStream.prototype._write = function(article, enc, next) {
  var self = this;
  Post.update({ _id: article.guid }, {
    _feed: self.feedId,
    title: article.title,
    description: article.description,
    summary: article.summary,
    imageUrl: article.image.url || "",
    imageTitle: article.image.title || ""
  }, { upsert: true }, function(err, post) {
    if (err) { next(err); }
    self.postIds.push(article.guid);
    next();
  });
};

/**
 * Return got post ids.
 */

PostWritableStream.prototype.getPostIds = function() {
  return this.postIds;
};
