
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Writable = require('stream').Writable,
    sanitise = require('../libs/sanitise');

var PostSchema = new Schema({
  _id: { type: String }, // guid
  _feed: {
    type: String,
    ref: "Feed"
  },
  link: {type: String },
  title: { type: String },
  description: { type: String },
  summary: { type: String },
  pubdate: { type: Date },
  imageUrl: { type: String },
  imageTitle: { type: String }
});

/**
 * Create `Post` writable stream.
 *
 * @param {String} feedurl
 * @return {Writable}
 * @api public
 */

PostSchema.statics.createWriteStream = function(feedurl) {
  var ws = new Writable({ objectMode: true }),
      postIds = [];

  ws._write = function(article, enc, next) {
    this.update({ _id: article.guid }, {
      _feed: feedurl,
      title: article.title,
      link: article.link,
      description: sanitise(article.description),
      summary: article.summary,
      pubdate: article.pubdate,
      imageUrl: article.image.url || "",
      imageTitle: article.image.title || ""
    }, { upsert: true }, function(err, post) {
      if (err) { next(err); }
      postIds.push(article.guid);
      next();
    });
  }.bind(this);

  ws.getPostIds = function() {
    return postIds;
  };

  ws.correctUrl = function(correcturl) {
    feedurl = correcturl;
  };

  return ws;
};

module.exports = mongoose.model('Post', PostSchema);
