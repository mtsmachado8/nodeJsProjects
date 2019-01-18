const log = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

const port = process.env.PORT || 3100;
const server = app.listen(port, () => log.info(`listening on port ${port}...`));

module.exports = server;