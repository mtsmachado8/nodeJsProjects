const log = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){
	const path = config.get('db');
	mongoose.connect(path)
		.then(() => log.info(`Connected to MongoDB on ${path}`))
};