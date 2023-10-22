const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).messages({
        'string.min': 'Минимальная длина имени - 2 символа',
        'string.max': 'Максимальная длина имени - 30 символов',
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'Неправильный формат почты',
        'any.required': 'Поле "email" обязательно для заполнения',
      }),
    }),
  }),
  updateUser,
);

module.exports = router;
