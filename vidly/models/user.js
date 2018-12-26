const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50
	},
	email: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 255,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		maxlength: 255,
	},
	isAdmin: Boolean,
	// roles: [],
	// operations: []

});

userSchema.methods.generateAuthToken = async function(){ // Arrow function dont have this. so use function itself
	return await jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey')); // just one Admin for now (mtsmachado8@gmail.com)
};

const User = mongoose.model('Users', userSchema);

function validate(user){

	const schema = {
		name: Joi.string().min(3).max(50).required(),
		email: Joi.string().min(3).max(255).required().email(),
		password: Joi.string().min(6).max(255).required(),
	};

	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validate;