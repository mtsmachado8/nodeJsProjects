const winston = require('winston');

module.exports = function(err, req, res, next){
	winston.error(err.message, err);

	// levels that can be set (only before this level will be logged)
	// error
	// warn
	// info
	// verbose
	// debug
	// silly

	res.status(500).send('Something Failed');
};