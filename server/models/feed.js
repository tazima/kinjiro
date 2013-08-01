
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Post = require("./post");

var FeedSchema = new Schema({
  _id: String,
  title: {
    type: String,
    require: true
  },
  link: {
    type: String,
    require: true
  },
  favicon: {
    type: String
  },
  lastCrawlDate: { type: Date, default: null },
  crawlEnd: { type: Boolean, default: false },
  _feed_posts: [{
    type: String,
    ref: "Post"
  }]
});

module.exports = mongoose.model('Feed', FeedSchema);
