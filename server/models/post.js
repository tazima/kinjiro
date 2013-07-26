
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
  _id: { type: String }, // guid
  _feed: {
    type: Schema.Types.ObjectId,
    ref: "Feed"
  },
  title: { type: String },
  description: { type: String },
  summary: { type: String },
  pubdate: { type: String},
  imageUrl: { type: String },
  imageTitle: { type: String }
});

module.exports = mongoose.model('Post', PostSchema);
