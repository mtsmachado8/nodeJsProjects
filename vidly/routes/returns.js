const express = require('express');
const router = express.Router();

// -Get all genres
router.post('/', async (req, res) => {
	if(!req.body.customerId || !req.body.movieId) return res.status(400).send('customerId not provided');
	res.status(401).send('Unauthorized');
});

module.exports = router;