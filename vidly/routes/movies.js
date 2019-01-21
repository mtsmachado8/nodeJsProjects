const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const validateReq = require('../middleware/validate-req');

// -Get all Movies
router.get('/', async(req, res) => {
	const movies = await Movie.find().sort('title');
	res.status(200).send(movies);
});

// -Post a Movie
router.post('/', validateReq(validate), async(req, res) => {
	const genre = await Genre.findById(req.body.genreId);
	if(!genre) return res.status(400).send('Invalid genre');

	const movie = new Movie({
		title: req.body.title,
		genre: { // -Embeding just id and name of Genre (could have 50 props)
			_id: genre._id,
			name: genre.name
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate
	});
	await movie.save();

	res.status(200).send(movie);
});

module.exports = router;