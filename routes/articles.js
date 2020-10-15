const articles = require('express').Router();
const { celebrate, Joi, CelebrateErr } = require('celebrate');
const validator = require('validator');
const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/articles');

const isUrl = (link) => {
  if (!validator.isURL(link)) throw new CelebrateErr();
  return link;
};

articles.get('/', getArticles);

articles.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(isUrl).required(),
    image: Joi.string().custom(isUrl).required(),
  }),
}), createArticle);

articles.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().alphanum().length(24),
  }),
}), deleteArticle);

module.exports = articles;
