const User = require('../models/user');
const { InternalServerError } = require('../errors/InternalServarError');
const { BadRequestError } = require('../errors/BadRequestError');
const { ConflictError } = require('../errors/ConflictError');
const { default: mongoose } = require('mongoose');

const NO_ERROR = 200;

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(NO_ERROR).send(user))
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictError('Данная почта уже используется'));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Невалидные данные'));
      }
      return next(new InternalServerError('Ошибка сервера'));
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(NO_ERROR).send(user);
    })
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};
const signout = (req, res) => {
  res.clearCookie('token');
  res.status(NO_ERROR).send({ message: 'Выход выполнен успешно' });
};

module.exports = {
  updateUser,
  getCurrentUser,
  signout,
};
