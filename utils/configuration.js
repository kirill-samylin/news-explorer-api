const mongoAddress = 'mongodb://localhost:27017/mestodb';
const mongoOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
const jwtSecret = 'HJroxJFi2EAFFB2j';

module.exports = {
  mongoAddress, mongoOptions, jwtSecret,
};
