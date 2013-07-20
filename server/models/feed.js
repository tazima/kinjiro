
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Post = require("./post");

var FeedSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  xmlurl: {
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
  _feed_posts: [{
    type: String,
    ref: "Post"
  }]
});

module.exports = mongoose.model('Feed', FeedSchema);
