const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const EmailError = require('../errors/EmailError');

const NO_ERROR = 200;

const updateUser = (req, res, next) => {
  // обновим имя найденного по _id пользователя
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { email: req.body.email, name: req.body.name }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail(() => new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.status(NO_ERROR).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Невалидный идентификатор пользователя.'));
      } if (err.code === 11000) {
        return next(new EmailError('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const {
    _id,
  } = req.user;
  User.findById({ _id })
    .then((userData) => {
      if (userData) {
        res.status(200).send({ userData });
      } else {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
    })
    .catch(
      (err) => {
        next(err);
      },
    );
};

module.exports = {
  updateUser,
  getCurrentUser,
};
