
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

/**
 * User schema
 */

var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  subscribes: [{
    _feed: { type: String, ref: 'Feed' },
    unread_count: { type: Number, default: 0 }
  }],
  _read_posts: [{ type: String, ref: 'Post' }]
});

/**
 * Pre `save`
 * make `user` password crypted.
 */

UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) { return next(); }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) { return next(err); }

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

/**
 * Compare `user` password to `candidatePassword`.
 *
 * @param {String} candidatePassword
 * @param {Function} cb
 * @api public
 */

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
