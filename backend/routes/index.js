const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const notFoundRouter = require('./notFound');

router.use(
  usersRouter,
  moviesRouter,
  notFoundRouter,
);

module.exports = router;
