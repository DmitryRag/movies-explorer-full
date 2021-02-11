const mongoose = require('mongoose');
const validator = require('validator');
const {
  incorrectTrailerUrlErr,
  incorrectImageUrlErr,
  incorrectThumbnaillUrlErr,
} = require('../constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: incorrectImageUrlErr,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: incorrectTrailerUrlErr,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: incorrectThumbnaillUrlErr,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
