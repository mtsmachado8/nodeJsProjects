const express = require('express');
const auth = require('../middleware/auth');
const {Rental} = require('../models/rental');


const router = express.Router();

// -Get all genres
router.post('/',auth, async (req, res) => {
	if(!req.body.customerId) return res.status(400).send('customerId not provided');
	if(!req.body.movieId) return res.status(400).send('customerId not provided');

	const rental = await Rental.findOne({
		'customer._id': req.body.customerId,
		'movie._id': req.body.movieId
	});

	if(!rental) res.status(404).send('Rental not Found!');
});

module.exports = router;