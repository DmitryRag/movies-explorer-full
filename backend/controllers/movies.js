const Movie = require('../models/movie');
const BadReqError = require('../errors/bad-req-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const {
  validationErr,
  movieIdNotFoundErr,
  noRightsToDeleteErr,
} = require('../constants');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
    movieId,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError(validationErr));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(movieIdNotFoundErr);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(noRightsToDeleteErr);
      }
      return Movie.findByIdAndDelete(req.params.movieId)
        .then((result) => {
          res.status(200).send(result);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError(movieIdNotFoundErr));
      }
      next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
