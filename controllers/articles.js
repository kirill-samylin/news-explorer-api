const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const { messageNotFoundArticleError, messageNotRights, messageDeleteArticle } = require('../utils/constants');
module.exports.getArticles = (req, res, next) => {
  const owner = req.user._id;
  Article.find({ owner })
    .then((articles) => res.send(articles))
    .catch((err) => next(new BadRequestError(err)));
};
module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.send(article))
    .catch((err) => next(new BadRequestError(err)));
};
module.exports.deleteArticle = (req, res, next) => {
  const owner = req.user._id;
  Article.findOne({ _id: req.params.articleId }).select('+owner')
    .orFail(() => new NotFoundError(messageNotFoundArticleError))
    .then((article) => {
      if (String(article.owner) !== owner) throw new ForbiddenError(messageNotRights);
      return Article.findByIdAndDelete(article._id);
    })
    .then(() => res.send({ message: messageDeleteArticle }))
    .catch(next);
};
