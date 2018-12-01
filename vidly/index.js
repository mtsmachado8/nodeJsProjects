const express = require('express');
const app = express();
const genres = require('./routes/genres');

app.use(express.json());
app.use('/api/genres', genres);


app.listen(3000, () => console.log('listening on port 3000...'));