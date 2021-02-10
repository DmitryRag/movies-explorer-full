require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const routes = require('./routes/index');
const {
  PORT, MONGO_URL, mongooseConfig,
} = require('./config');
const {
  serverReadyToFailErr,
} = require('./constants');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL, mongooseConfig);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(serverReadyToFailErr);
  }, 0);
});

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(helmet());
app.use(cors());
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}: http://localhost:3000`);
});
