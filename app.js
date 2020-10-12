require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const users = require('./routes/users');
const articles = require('./routes/articles');
const authRouter = require('./routes/auth');
const limiter = require('./utils/limiter');
const { PORT = 3000 } = process.env;
const app = express();
const auth = require('./middlewares/auth');
const { mongoAddress, mongoOptions } = require('./utils/configuration');
const { messageNotFoundError, messageServerError, messageCrash } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
app.use(cors({ origin: true }));

// подключаемся к серверу mongo
mongoose.connect(mongoAddress, mongoOptions)
  .then(() => console.log('DB Connected!'))
  .catch((err) => {
    console.log(err);
  });
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(messageCrash);
  }, 0);
});

app.use('/', authRouter);

app.use(auth);

app.use('/users', users);
app.use('/articles', articles);

app.all('*', (req, res) => {
  res.status(404).send({ message: messageNotFoundError });
});

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? messageServerError : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
