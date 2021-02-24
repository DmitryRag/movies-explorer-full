const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const NotAuthError = require('../errors/not-auth-error');
const {
  enterEmailMessage,
  wrongPassOrEmailErr,
  sameUserErr,
} = require('../constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: enterEmailMessage,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(NotAuthError(wrongPassOrEmailErr));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthError(wrongPassOrEmailErr));
          }
          return user;
        });
    });
};

userSchema.statics.checkUserByEmail = function (email) {
  return this.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new NotAuthError(sameUserErr));
      }
      return Promise.resolve();
    });
};

module.exports = mongoose.model('user', userSchema);
