const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const mongoose = require('mongoose');
const log = require('winston');

const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

const validateReq = require('../middleware/validate-req');

Fawn.init(mongoose); // Transactions

router.get('/', async (req, res) => {
	const rentals = await Rental.find().sort('-dateOut');
	res.send(rentals);
});

router.post('/', validateReq(validate), async (req, res) => {
	const customer = await Customer.findById(req.body.customerId);
	if(!customer) return res.status(400).send('Invalid Customer');

	const movie = await Movie.findById(req.body.movieId);
	if(!movie) return res.status(400).send('Invalid Movie');

	if(movie.numberInStock === 0) return res.status(400).send('Movie not available');

	let rental = new Rental({
		customer:{
			_id: customer._id,
			name: customer.name,
			phone: customer.phone
		},
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate
		}
	});
	// rental = await rental.save(); // -Changed to Fawn to use transactions
	// movie.numberInStock--;
	// movie.save();

	try{
		new Fawn.Task()
			.save('rentals', rental)
			.updateOne('movies', {_id: movie._id}, {
			$inc: {numberInStock: -1}
		}).run();

		res.send(rental);
	}catch(e){
		log.error('Internal Error', e.message);
		res.status(500).send('Something failed')
	}
	
});

router.put('/', async (req, res) => {

});

module.exports = router;