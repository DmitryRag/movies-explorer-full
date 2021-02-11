const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');
const NotFoundError = require('../errors/not-found-error');
const BadReqError = require('../errors/bad-req-error');
const ConflictError = require('../errors/conflict-error');
const NotAuthError = require('../errors/not-auth-error');
const {
  userIdNotFoundErr,
  validationErr,
  sameUserErr,
  wrongPassOrEmailErr,
} = require('../constants');

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(new NotFoundError(userIdNotFoundErr))
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadReqError(validationErr);
      }
      throw err;
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => User.find({ _id: user._id }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReqError(validationErr);
      }
      if (err.code === 11000) {
        throw new ConflictError(sameUserErr);
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  const newName = req.body.name;
  User.findOneAndUpdate(
    { _id: id },
    { name: newName },
    { runValidators: true, new: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReqError(err.message);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotAuthError(wrongPassOrEmailErr);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotAuthError(wrongPassOrEmailErr);
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { noTimestamp: true, expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  getUser, createUser, updateUser, login,
};
