const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly')
	.then(() => console.log('Connected'))
	.catch(err => console.log('Not connected: ', err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', genres);

app.listen(3000, () => console.log('listening on port 3000...'));