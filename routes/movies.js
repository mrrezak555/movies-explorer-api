const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/^https?:\/\/[\w\\-]+(\.[\w\\-]+)+[/#?]?.*$/),
    trailer: Joi.string().required().regex(/^https?:\/\/[\w\\-]+(\.[\w\\-]+)+[/#?]?.*$/),
    thumbnail: Joi.string().required().regex(/^https?:\/\/[\w\\-]+(\.[\w\\-]+)+[/#?]?.*$/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.get('/', getMovies);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().regex(/^[a-f\d]{24}$/i),
  }),
}), deleteMovie);

module.exports = router;
