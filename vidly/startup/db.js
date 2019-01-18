const log = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){
	mongoose.set('useCreateIndex', true); // To avoid a deprecated warning: collection.ensureIndex
	mongoose.set('useNewUrlParser', true); // To avoid a deprecated warning: URL string parser
	mongoose.set('useFindAndModify', false); // To avoid a deprecated warning: collection.findAndModify

	const path = config.get('db');
	mongoose.connect(path)
		.then(() => log.info(`Connected to MongoDB on ${path}`))
};