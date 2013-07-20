
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeedSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  url: {
    type: String,
    require: true
  },
  _user : {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'User'
  }
});

module.exports = mongoose.model('Feed', FeedSchema);
