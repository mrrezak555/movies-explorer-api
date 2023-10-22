const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^(http:\/\/|https:\/\/)?(www\.)?.*/.test(value),
      message: 'Неверный формат ссылки',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^(http:\/\/|https:\/\/)?(www\.)?.*/.test(value),
      message: 'Неверный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^(http:\/\/|https:\/\/)?(www\.)?.*/.test(value),
      message: 'Неверный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

movieSchema.statics.isMovieOwned = function (movieId, userId) {
  return this.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return Promise.reject(new Error('Карточка не найдена'));
      }
      return JSON.stringify(movie.owner) === JSON.stringify(userId);
    })
    .catch((err) => err);
};

module.exports = mongoose.model('movie', movieSchema);
