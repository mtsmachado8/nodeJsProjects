const express = require('express');
const router = express.Router();
const {Customer, validate } = require('../models/customer');
const validateReq = require('../middleware/validate-req');

// -Get all customers
router.get('/', async (req, res) => {
	const customers = await Customer.find().sort('name');
	res.send(customers);
});

// -Get a specific customer
router.get('/:id', async (req, res) => {
	const customer = await Customer.findById(req.params.id);

	if(!customer) res.status(404).send('The customer couldnt be found');

	return res.status(200).send(customer);

});

// -Delete a customers
router.delete('/:id', async (req, res) => {
	const customer = await Customer.findByIdAndDelete(req.params.id);

	if(!customer) res.status(404).send('The customer couldnt be found');

	res.status(200).send(customer);

});

// -Post a new customer
router.post('/',validateReq(validate), async (req, res) => {

	let customer = new Customer(req.body);

	customer = await customer.save();
	res.send(customer);
});

// -Put a updated customer
router.put('/:id', validateReq(validate), async (req, res) => {

	const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {new: true} );

	if(!customer) return res.status(404).send('The customer was not found');

	res.send(customer);
});

module.exports = router;