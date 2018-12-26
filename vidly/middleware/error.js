module.exports = function(err, req, res, next){
	//Log Exception
	res.status(500).send('Something Failed');
};