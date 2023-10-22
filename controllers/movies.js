const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');
const { InternalServerError } = require('../errors/InternalServarError');
const { BadRequestError } = require('../errors/BadRequestError');
const mongoose = require('mongoose');
const { constants } = require('http2');

const NO_ERROR = 200;

const getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => res.send(movies))
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};

const createMovie = (req, res, next) => {
  console.log('create');
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(constants.HTTP_STATUS_CREATED).send(movie);
    })
    .catch((error) => {
      console.log(error);
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Невалидные данные'));
      }
      return next(new InternalServerError('Ошибка сервера'));
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.isMovieOwned(movieId, req.user._id)
    // eslint-disable-next-line consistent-return
    .then((matched) => {
      if (!matched) {
        return next(
          new ForbiddenError('Это не ваша карточка, вы не можете ее удалить'),
        );
      }
      Movie.findByIdAndDelete(movieId)
        .then((movie) => {
          if (movie) {
            res.send(movie);
            return;
          }
          // eslint-disable-next-line consistent-return
          return next(new NotFoundError('Карточка не найдена'));
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.CastError) {
            return next(new BadRequestError('Невалидные данные'));
          }
          return next(new InternalServerError('Ошибка сервера'));
        });
    })
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
