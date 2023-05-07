const router = require('express').Router();
const auth = require('../middlewares/auth');
// eslint-disable-next-line import/order
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');

const userRoutes = require('./users');
const moviesRoutes = require('./movies');
const {
  login,
  createUser,
} = require('../controllers/auth');

router.use('/movies', auth, moviesRoutes);
router.use('/users', auth, userRoutes);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);
router.use((req, res, next) => next(new NotFoundError('Проверьте корректность пути запроса')));

module.exports = {
  router,
};
