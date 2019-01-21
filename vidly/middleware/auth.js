const jwt = require('jsonwebtoken');
const config = require('config');
const log = require('winston');

module.exports = async function(req, res, next){
	log.silly('Auth Middleware...');

	const token = req.header('x-auth-token');
	if(!token) return res.status(401).send('Access Denied. No token provided'); // 401 used when jwt invalid

	try{
		req.user = await jwt.verify(token, config.get('jwtPrivateKey'));
		if(!req.user) return res.status(401).send('Access Denied. Invalid token');

		log.info('Auth Middleware Authorized User: ', req.user._id);
		next();
	}catch(e){
		log.warn('Invalid Token: ', e.message);
		res.status(400).send('Invalid Token');
	}
};