const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mongoose = require('mongoose');
const { constants } = require('http2');
const { InternalServerError } = require('../errors/InternalServarError');
const { ConflictError } = require('../errors/ConflictError');
const { BadRequestError } = require('../errors/BadRequestError');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((data) => {
          const token = jwt.sign(
            { _id: data._id },
            process.env.NODE_ENV === 'production'
              ? process.env.JWT_SECRET
              : 'dev-secret',
            {
              expiresIn: '7d',
            },
          );
          res
            .cookie('token', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            })
            .status(constants.HTTP_STATUS_CREATED)
            .send({
              email: data.email,
              _id: data._id,
              name: data.name,
            });
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            return next(new BadRequestError('Невалидные данные'));
          }
          if (error.code === 11000) {
            return next(new ConflictError('Данная почта уже используется'));
          }
          return next(new InternalServerError('Ошибка сервера'));
        });
    })
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production'
          ? process.env.JWT_SECRET
          : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .send({
          email: user.email,
          _id: user._id,
          name: user.name,
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createUser,
  login,
};
