const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
	console.log('Auth Middleware...');

	const token = req.header('x-auth-token');
	if(!token) return res.status(401).send('Access Denied. No token provided'); // 401 used when jwt invalid

	try{
		req.user = jwt.verify(token, config.get('jwtPrivateKey'));
		console.log('Auth Middleware Authorized User: ', req.user._id);
		next();
	}catch(e){
		res.status(400).send('Invalid Token');
	}
};