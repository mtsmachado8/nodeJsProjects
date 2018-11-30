const Joi = require('joi');
const express = require('express');

const app = express();

const genres = [
	{ name: 'horror'},
	{ name: 'comedy'},
	{ name: 'action'}
];

app.get('/api/genres', (req, res) => {
	res.send(genres);
});

app.listen(3000, () => console.log('listening on port 3000...'));