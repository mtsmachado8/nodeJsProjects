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
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user');

const mongoose = require('mongoose');
const moment = require('moment');

describe('/api/return', ()=> {
	let server;
	let customerId;
	let movieId;
	let rental;
	let movie;
	let token;

	beforeEach( async() => {
		server = await require('../../index');
		token = await new User().generateAuthToken();

		customerId = mongoose.Types.ObjectId();
		movieId = mongoose.Types.ObjectId();

		movie = new Movie({
			_id: movieId,
			title: '12345',
			dailyRentalRate: 2,
			genre: {name: '12345'},
			numberInStock: 10
		});
		await movie.save();

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
		await Movie.deleteMany({});

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

	it('400 if no rendal found for this customer/movie', async() => {
		rental.dateReturned = new Date();

		await rental.save();

		const res = await executeRequest();
		expect(res.status).toBe(400);
	});

	it('200 if valid request', async() => {
		const res = await executeRequest();

		expect(res.status).toBe(200);
	});

	it('ReturnedDate if valid request', async() => {
		await executeRequest();

		const rentalInDb = await Rental.findById(rental._id);
		const diff = new Date() - rentalInDb.dateReturned;
		expect(diff).toBeLessThan(10*1000); // Less than 10 seconds
	});

	it('RentalFee if valid request', async() => {

		rental.dateOut = moment().add(-7, 'days').toDate();
		await rental.save();

		const res = await executeRequest();

		const rentalInDb = await Rental.findById(rental._id);

		const numberOfDays = moment().diff(rentalInDb.dateOut, 'days');

		expect(rentalInDb.rentalFee).toBe(numberOfDays * rentalInDb.movie.dailyRentalRate); // Less than 10 seconds

	});

	it('Increase movie in stock if valid request', async() => {
		const res = await executeRequest();

		const rentalInDb = await Rental.findById(rental._id);
		const movieInDb = await Movie.findById(rentalInDb.movie._id);


		expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1); // Less than 10 seconds
	});

	it('Return the rental if valid request', async() => {
		const res = await executeRequest();

		// expect(res.body).toHaveProperty('dateOut');
		// expect(res.body).toHaveProperty('dateReturned');
		// expect(res.body).toHaveProperty('rentalFee');
		// expect(res.body).toHaveProperty('customer');
		// expect(res.body).toHaveProperty('movie');
		//Or
		expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut','dateReturned','rentalFee','customer','movie']));
	});


});