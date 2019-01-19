// POST /api/returns {customerId, movieId}

// 401 if client is not logged in
// 400 if customerId is not provided
// 400 if movieId is not provided
// 404 if no rendal found for this customer/movie
// 400 if rental already processed

// 200 if valid request
// set the return date
// calculate the rental fee
// increase the stock
// return the rental

const request = require('supertest');
const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');

const mongoose = require('mongoose');

describe('/api/return', ()=> {
	let server;
	let customerId;
	let movieId;
	let rental;
	let token;

	beforeEach( async() => {
		server = await require('../../index');
		token = await new User().generateAuthToken();

		customerId = mongoose.Types.ObjectId();
		movieId = mongoose.Types.ObjectId();

		rental = new Rental({
			customer: {
				_id: customerId,
				name: '12345',
				phone: '123456789'
			},
			movie: {
				_id: movieId,
				title: '12345',
				dailyRentalRate: 2
			},
		});

		await rental.save();
	});

	afterEach(async () => {
		await Rental.deleteMany({});
		await server.close();
	});

	const executeRequest = () => {
		return request(server)
			.post('/api/returns')
			.set('x-auth-token', token)
			.send({customerId, movieId});
	};

	it('401 if client is not logged in', async() => {
		token = '';

		const res = await executeRequest();

		expect(res.status).toBe(401);
	});

	it('400 if customerId is not provided', async() => {
		customerId = '';

		const res = await executeRequest();

		expect(res.status).toBe(400);

	});

	it('400 if movieId is not provided', async() => {
		movieId = '';

		const res = await executeRequest();

		expect(res.status).toBe(400);

	});

	it('404 if no rendal found for this customer/movie', async() => {
		await rental.delete();

		const res = await executeRequest();
		expect(res.status).toBe(404);
	});
});