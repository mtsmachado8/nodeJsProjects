const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');

// -Get all users
router.get('/', async (req, res) => {
	const users = await User.find().sort('name');
	res.send(users);
});

// -Get a specific user
router.get('/:id', async (req, res) => {
	const user = await User.findById(req.params.id);

	if(!user) res.status(404).send('The user couldnt be found');

	return res.status(200).send(user);

});

// -Delete a user
router.delete('/:id', async (req, res) => {
	const genre = await User.findByIdAndDelete(req.params.id);

	if(!genre) res.status(404).send('The genre couldnt be found');

	res.status(200).send(genre);

});

// -Post a new user
router.post('/', async (req, res) => {
	try{
		const { error } = validate(req.body);
		if(error) return res.status(400).send(error.details[0].message);

		let user = User.findOne({email: req.body.email});
		if(!user) return res.status(400).send('User already registered.');

		user = new User(_.pick(req.body, ['name', 'email', 'password']));

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);

		await user.save();

		res.send(_.pick(user, ['_id', 'name', 'email']));
	}catch(e){
		res.status(500).send(e.message);
	}
});

// -Put a updated genre
router.put('/:id', async (req, res) => {
	const { error } = validate(req.body);

	if(error) return res.status(400).send(error.details[0].message);

	const genre = await User.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true} );

	if(!genre) return res.status(404).send('The genre was not found');

	res.send(genre);
});

module.exports = router;