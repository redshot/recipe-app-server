const mongoose = require('mongoose')
const crypto = require('crypto')

// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: String,
  role: {
    type: String,
    default: 'subscriber'
  },
  resetPasswordLink: {
    type: String,
    default: ''
  },
}, {timestamps: true})

// virtual
userSchema.virtual('password')
.set(function(password) {
  this._password = password
  this.salt = this.makeSalt()
  this.hashed_password = this.encryptPassword(password)
})
.get(function() {
  return this._password
})

// methods
userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
      .createHmac('sha1', this.salt)
      .update(password)
      .digest('hex');
    } catch(err) {
      return '';
    }
  },

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + ''
  }
};

module.exports = mongoose.model('User', userSchema)

/**
 * We used regular functions on userSchema.virtual('password') because because the this keyword work differently with arrow functions
 *  - We used _(underscore) in .set(function(password) {this._password = password} to make sure the variable is only used inside 
 *    the function. It is like a temporary variable
 * The virtual field will take the password as input then hash it and save in the database as a hashed_password
 * authenticate: function(plainText){} will take the plain password hash it and compare with the one saved in the database. The
 *  hashed password saved in the database is this.hashed_password
 *  - If the plain password hashed by encryptPassword(plainText) matches with the one saved in the database, then we authenticate user
 * We need to export the user model to create a new user
 */