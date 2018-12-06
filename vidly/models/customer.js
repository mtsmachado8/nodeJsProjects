const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 15
	},
	isGold: {
		type: Boolean,
		default: false
	},
	phone: {
		type: String,
		required: true,
		minlength: 9,
		maxlength: 15
	}
}));

function validateCustomer(customer){

	const schema = {
		name: Joi.string().min(5).max(50).required(),
		phone: Joi.string().min(9).max(15).required(),
		isGold: Joi.boolean()
	};

	return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;