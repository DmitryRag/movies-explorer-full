const notFoundRouter = require('express').Router();
const NotFoundError = require('../errors/not-found-error');
const {
  adressNotFoundErr,
} = require('../constants');

notFoundRouter.all('*', () => {
  throw new NotFoundError(adressNotFoundErr);
});

module.exports = notFoundRouter;
