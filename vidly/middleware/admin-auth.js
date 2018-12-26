module.exports = function(req, res, next){
	console.log('Auth Admin Middleware...');
	if(!req.user.isAdmin){
		console.log('Auth Admin Middleware Refused');
		return res.status(403).send('Forbidden, only allowed to admins'); // 403 Used when you dont have access to that resource
	}
	console.log('Auth Admin Middleware Granted');
	next();
};