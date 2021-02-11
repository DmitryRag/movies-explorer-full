const moviesRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { auth } = require('../middlewares/auth');
const { postMovieValidation, deleteMovieValidation } = require('../middlewares/validation');

moviesRouter.get('/movies', auth, getMovies);
moviesRouter.post('/movies', auth, postMovieValidation, createMovie);
moviesRouter.delete('/movies/:movieId', auth, deleteMovieValidation, deleteMovie);

module.exports = moviesRouter;
