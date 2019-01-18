const config = require('config');
const log = require('winston');
// require('log-mongodb');
require('express-async-errors');

module.exports = function(){
	const env_logging_level = config.get('logging_level');
	const console = new log.transports.Console({colorize: true, prettyPrint: true, level: env_logging_level});
	const file = new log.transports.File({filename: 'uncaughtException.log'});

	log.handleExceptions( console, file);

	process.on('unhandledRejection', (ex) => {
		throw ex;
	});

	log.configure({
		transports: [
			console,
			new log.transports.File({ filename: 'logfile.log' })
		]
	});
	// log.add(log.transports.MongoDB, {
	// 	db: 'mongodb://localhost/vidly',
	// 	level: 'error' // if info, so error, warn and info will be logged see error.js
	// });
};