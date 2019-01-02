const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function(path){
	mongoose.connect(path)
		.then(() => winston.info(`Connected to MongoDB on ${path}`))
};