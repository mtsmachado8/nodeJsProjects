const auth = require('../middleware/auth'); //Authorization not Authentication
const admin = require('../middleware/admin-auth'); //Authorization not Authentication
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');

const validateReq = require('../middleware/validate-req');

// -Get all users
router.get('/', async (req, res) => {
	const users = await User.find().sort('name');
	res.send(users);
});

// -Get the currently logged in user
router.get('/me', auth, async (req, res) => {
	try{
		const user = await User.findById(req.user._id).select('-password');
		if(!user) res.status(404).send('The user couldnt be found');

		res.status(200).send(user);
	}catch(e){
		console.log(e);
	}
	
});

// -Delete a user
router.delete('/:id', [auth, admin], async (req, res) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if(!user) res.status(404).send('The user couldnt be found');

	res.status(200).send(user);

});

// -Post a new user
router.post('/', validateReq(validate), async (req, res) => {
	try{
		let user = await User.findOne({email: req.body.email});
		if(user) return res.status(400).send('User already registered.');

		user = new User(_.pick(req.body, ['name', 'email', 'password']));

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);

		await user.save();

		const token = await user.generateAuthToken();
		res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

	}catch(e){
		res.status(500).send(e.message);
	}
});

// -Put a updated user
router.put('/:id',validateReq(validate), async (req, res) => {
	const user = await User.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true} );

	if(!user) return res.status(404).send('The user was not found');

	res.send(user);
});

module.exports = router;