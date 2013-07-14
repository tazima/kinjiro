
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var WalkerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

WalkerSchema.pre('save', function(next) {
  var walker = this;

  // only hash the password if it has been modified (or is new)
  if (!walker.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(walker.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      walker.password = hash;
      next();
    });
  });
});

WalkerSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Walker', WalkerSchema);
