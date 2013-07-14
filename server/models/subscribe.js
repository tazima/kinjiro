
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SubscribeSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  url: {
    type: String,
    require: true
  },
  _walker : {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'Walker'
  }
});

module.exports = mongoose.model('Subscribe', SubscribeSchema);