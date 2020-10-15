const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const RepeatEmailError = require('../errors/RepeatEmailError');
const { messageErrorEmailAndPassword, messageNotFoundUserError } = require('../utils/constants');
const { NODE_ENV, JWT_SECRET } = process.env;
const { jwtSecret } = require('../utils/configuration');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError(messageNotFoundUserError);
      res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((data) => res.status(201).send({
      email: data.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new RepeatEmailError(err));
      } else {
        next(new BadRequestError(err));
      }
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError(messageErrorEmailAndPassword);
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new UnauthorizedError(messageErrorEmailAndPassword);
          return user;
        });
    })
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : jwtSecret, { expiresIn: '7d' }),
      });
    })
    .catch(next);
};
