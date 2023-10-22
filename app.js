require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('./middlewares/cros');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { router } = require('./routes/index');
const cookieParser = require('cookie-parser');

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const INTERNAL_ERROR = 500;

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

const app = express();
app.use(requestLogger);
app.use(cors);
app.use(cookieParser());
app.use(express.json());
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = INTERNAL_ERROR, message } = err;
  if (statusCode === INTERNAL_ERROR) {
    return res.status(INTERNAL_ERROR).send({ message: 'на сервере произошла ошибка' });
  }
  res.status(statusCode).send({ message });
  return next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
