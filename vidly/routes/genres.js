const Joi = require('joi');
const express = require('express');
const router = express.Router();

const genres = [
	{ name: 'horror'},
	{ name: 'comedy'},
	{ name: 'action'}
];

// -Get all genres
router.get('/', (req, res) => {
	res.send(genres);
});

// -Get a specific genre
router.get('/:id', (req, res) => {
	const genre = genres.find(genre => genre.id === parseInt(req.params.id));
	if(!genre)
		res.status(400).send('The genre couldnt be found');

	return res.status(200).send(genre);

});

// -Delete a genre
router.delete('/:id', (req, res) => {
	const genre = genres.find(genre => genre.id === parseInt(req.params.id));
	if(!genre)
		res.status(400).send('The genre couldnt be found');

	genres.splice(genres.indexOf(genre), 1);

	res.status(200).send(genre);

});

// -Post a new genre
router.post('/', (req, res) => {
	const { error } = validateGenre(req.body);
	if(error)
		return res.status(400).send(error.details[0].message);

	const genre = {
		id: genres.length + 1,
		name: req.body.name
	};

	genres.push(genre);
	res.send(genre);
});



function validateGenre(genre){

	const schema = {
		name: Joi.string().min(3).required()
	};

	return Joi.validate(genre, schema);
}

module.exports = router;