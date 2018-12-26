const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

// -Post auth
router.post('/', async (req, res) => {
	try{
		const { error } = validate(req.body);
		if(error) return res.status(400).send(error.details[0].message);

		let user = await User.findOne({email: req.body.email});
		if(!user) return res.status(400).send('Invalid email or password');

		const valid = await bcrypt.compare(req.body.password, user.password); //first data plain text password second is hashed
		if(!valid) return res.status(400).send('Invalid email or password');

		const token = await user.generateAuthToken();

		res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
	}catch(e){
		console.log(e);
		res.status(500).send(e.message);
	}
});

function validate(req){

	const schema = {
		email: Joi.string().min(3).max(255).required().email(),
		password: Joi.string().min(6).max(255).required(),
	};

	return Joi.validate(req, schema);
}

module.exports = router;