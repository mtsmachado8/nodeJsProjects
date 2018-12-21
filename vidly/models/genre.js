const mongoose = require('mongoose');
import Joi from 'joi'

const schema =  mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 15
	}
});

const Genre = mongoose.model('Genre', schema);

function validate(genre){

	const schema = {
		name: Joi.string().min(3).required()
	};

	return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genreSchema = schema;
exports.validate = validate;