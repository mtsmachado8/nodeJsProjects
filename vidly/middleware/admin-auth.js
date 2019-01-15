const log = require('winston');

module.exports = function(req, res, next){
	log.silly('Auth Admin Middleware...');

	if(!req.user.isAdmin){
		log.warn('Forbidden! Auth Admin Middleware Refused');
		return res.status(403).send('Forbidden, only allowed to admins'); // 403 Used when you dont have access to that resource
	}
	log.warn('Auth Admin Middleware Granted');
	next();
};