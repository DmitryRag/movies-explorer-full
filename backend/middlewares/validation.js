const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const {
  incorrectTrailerUrlErr,
  incorrectImageUrlErr,
  incorrectThumbnaillUrlErr,
} = require('../constants');

const updateValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const signupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().min(2).max(30),
  }),
});

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
  }),
});

const postMovieValidation = celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) {
        return helpers.message(incorrectImageUrlErr);
      }
      return value;
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) {
        return helpers.message(incorrectTrailerUrlErr);
      }
      return value;
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) {
        return helpers.message(incorrectThumbnaillUrlErr);
      }
      return value;
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const deleteMovieValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().alphanum().required(),
  }),
});

module.exports = {
  signinValidation, signupValidation, updateValidation, postMovieValidation, deleteMovieValidation,
};
