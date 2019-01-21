const express = require('express');
const auth = require('../middleware/auth');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const Joi = require('joi');
const router = express.Router();
const validateReq = require('../middleware/validate-req');

function validateReturn(req){

	const schema = {
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required()
	};

	return Joi.validate(req, schema);
}

// -Get all genres
router.post('/', [auth, validateReq(validateReturn)], async (req, res) => {
	const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

	if(!rental) return res.status(404).send('Rental not Found!');

	if(rental.dateReturned) return res.status(400).send('Return already processed');

	rental.return();
	await rental.save();

	await Movie.updateOne({_id: rental.movie._id}, {
		$inc: {numberInStock: 1}
	});


	return res.send(rental);
});

module.exports = router;