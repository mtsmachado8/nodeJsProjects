const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/config')();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')('mongodb://localhost/vidly');
require('./startup/validation')();

app.listen(3000, () => winston.info('listening on port 3000...'));