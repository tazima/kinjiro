
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
  _walker : {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'Walker'
  }
});
