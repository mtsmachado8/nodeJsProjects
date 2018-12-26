module.exports = function asyncMiddleware(handler){
	// Express requires a function with this arguments (req, res, next) witch it will call
	return async (req, res, next) => {
		try{
			await handler(req, res);
		}catch(e){
			next(e)
		}
	};
};