const EventEmiter = require('events');
const Logger = require('./logger');
const logger = new Logger();

logger.on('messageLogged', element => {
	console.log('Listener Called: ', element)
});

//Raise event
logger.log('lalalalaa');