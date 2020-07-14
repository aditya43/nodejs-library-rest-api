require('./config/loadEnv');

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const morganLogger = require('./middleware/morganLogger');
// const authorRoutes = require('./routes/authors');
// const bookRoutes = require('./routes/books');

const app = express();
app.use(helmet());
app.use(morganLogger);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(authorRoutes);
// app.use(bookRoutes);

module.exports = app;
