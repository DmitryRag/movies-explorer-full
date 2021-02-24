const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');
const NotFoundError = require('../errors/not-found-error');
const {
  userIdNotFoundErr,
} = require('../constants');

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userIdNotFoundErr);
      }
      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  User.checkUserByEmail(email)
    .then(() => User.findByIdAndUpdate(
      id,
      { name, email },
      { runValidators: true, new: true },
    ))
    .then((result) => res.send(result))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  User.checkUserByEmail(email)
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({
      email,
      name,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { noTimestamp: true, expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser, createUser, updateUser, login,
};
