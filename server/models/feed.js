
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
  }
});

module.exports = mongoose.model('Feed', FeedSchema);
