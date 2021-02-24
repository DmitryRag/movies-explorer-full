const usersRouter = require('express').Router();
const {
  getUser,
  createUser,
  updateUser,
  login,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { signinValidation, signupValidation, updateValidation } = require('../middlewares/validation');

usersRouter.get('/users/me', auth, getUser);
usersRouter.patch('/users/me', auth, updateValidation, updateUser);
usersRouter.post('/signup', signupValidation, createUser);
usersRouter.post('/signin', signinValidation, login);

module.exports = usersRouter;
