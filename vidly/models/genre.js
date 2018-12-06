const mongoose = require('mongoose');

const Genre = mongoose.model('Genre', mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 15
	}
}));

function validateGenre(genre){

	const schema = {
		name: Joi.string().min(3).required()
	};

	return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validate = validateGenre;