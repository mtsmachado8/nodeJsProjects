const mongoose = require('mongoose');
const Joi = require('joi');

const schema =  mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	}
});

const Genre = mongoose.model('Genre', schema);

function validate(genre){
	const schema = {
		name: Joi.string().min(5).max(50).required()
	};

	return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genreSchema = schema;
exports.validate = validate;