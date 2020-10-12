const authRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  login, createUser,
} = require('../controllers/users');

authRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().min(5),
    password: Joi.string().required().min(8),
  }),
}), login);

authRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = authRouter;
