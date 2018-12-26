const error_handler = require('./middleware/error');
require('express-async-errors');
const config = require('config');

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

const mongoose = require('mongoose');

if(!config.get('jwtPrivateKey')){
	console.log('FATAL: jwtPrivateKey not defined');
	process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly')
	.then(() => console.log('Connected'))
	.catch(err => console.log('Not connected: ', err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error_handler); //Using own middleware for handling errors

app.listen(3000, () => console.log('listening on port 3000...'));