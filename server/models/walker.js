
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var WalkerSchema = new Schema({
    walker_id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    password: {
      type: String,
      required: true
    }
});

module.exports = mongoose.model('Walker', WalkerSchema);
