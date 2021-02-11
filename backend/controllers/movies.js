const Movie = require('../models/movie');
const ServerError = require('../errors/server-error');
const BadReqError = require('../errors/bad-req-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const {
  generalServerErr,
  validationErr,
  movieIdNotFoundErr,
  noRightsToDeleteErr,
} = require('../constants');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(() => next(new ServerError(generalServerErr)));
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    date,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEn,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    date,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEn,
    owner,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReqError(validationErr);
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.id })
    .orFail(new NotFoundError(movieIdNotFoundErr))
    .select('+owner')
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(noRightsToDeleteErr);
      }
      Movie.deleteOne(movie)
        .then(() => {
          const deletedMovie = movie.toObject();
          delete deletedMovie.owner;
          res.send(deletedMovie);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReqError(validationErr);
      }
      throw err;
    })
    .catch(next);
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
