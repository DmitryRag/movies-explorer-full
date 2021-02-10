const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  createUser,
  updateUser,
  login,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

usersRouter.get('/users/me', auth, getUser);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

usersRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

usersRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
  }),
}), login);

module.exports = usersRouter;
