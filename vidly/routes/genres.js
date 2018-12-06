const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');

// -Get all genres
router.get('/', async (req, res) => {
	const genres = await Genre.find().sort('name');
	res.send(genres);
});

// -Get a specific genre
router.get('/:id', async (req, res) => {
	const genre = await Genre.findById(req.params.id);

	if(!genre) res.status(404).send('The genre couldnt be found');

	return res.status(200).send(genre);

});

// -Delete a genre
router.delete('/:id', async (req, res) => {
	const genre = await Genre.findByIdAndDelete(req.params.id);

	if(!genre) res.status(404).send('The genre couldnt be found');

	res.status(200).send(genre);

});

// -Post a new genre
router.post('/', async (req, res) => {
	const { error } = validate(req.body);

	if(error) return res.status(400).send(error.details[0].message);

	let genre = new Genre({ name: req.body.name });

	genre = await genre.save();
	res.send(genre);
});

// -Put a updated genre
router.put('/:id', async (req, res) => {
	const { error } = validate(req.body);

	if(error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true} );

	if(!genre) return res.status(404).send('The genre was not found');

	res.send(genre);
});

module.exports = router;