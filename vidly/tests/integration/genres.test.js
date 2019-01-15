const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
	beforeEach( async() => { server = await require('../../index'); });
	afterEach( async() => {
		await Genre.remove({}); //remove all genres
		await server.close();
	});

	describe('GET /', () => {
		it('should return all genres', async() => {
			await Genre.collection.insertMany([
				{name: 'genre1'},
				{name: 'genre2'}
			]);

			const res = await request(server).get('/api/genres');
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
			expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('should return a specific genre if valid id', async() => {
			const genre = new Genre({name: 'genre1'});
			await genre.save();

			const res = await request(server).get('/api/genres/' + genre._id);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('name', genre.name);
		});

		it('should return a 404 error if invalid id', async() => {
			const res = await request(server).get('/api/genres/1');

			expect(res.status).toBe(404);
		});

		it('should return a 404 error if no genre with the given id exists', async() => {
			const id = mongoose.Types.ObjectId();
			const res = await request(server).get('/api/genres/'+ id);

			expect(res.status).toBe(404);
		});
	});

	describe('POST /', async() => {

		// Define the happy path, and in each test, change one paramether
		// that clearly align with the name of the test

		let token;
		let name;
		let res;

		const executeRequest = async() => {
			return await request(server)
				.post('/api/genres/')
				.set('x-auth-token', token)
				.send({name: name}); // {name} in ES6 = {name: name}
		};

		beforeEach(async() => {
			token = await new User({isAdmin: true}).generateAuthToken(); // Generating an admin token to every test
			name = 'genre1'; // Generating an name to every test
		});

		it('Should return a 401 if client is not logged in', async() => {
			token = ''; // Don't have a login token

			res = await executeRequest();
			expect(res.status).toBe(401);
		});

		it('Should return a 403 if the logged user is logged but not an admin', async() => {
			token = await new User({isAdmin: false}).generateAuthToken();

			res = await executeRequest();
			expect(res.status).toBe(403);
		});

		it('Should return a 400 if genre is less than 5 characteres', async() => {
			name = '1234';

			res = await executeRequest();
			expect(res.status).toBe(400);
		});

		it('Should return a 400 if genre is more than 50 characteres', async() => {
			name = new Array(52).join('a'); //Big name

			res = await executeRequest();
			expect(res.status).toBe(400);
		});

		it('Should save the genre if it is a valid one', async() => {
			res = await executeRequest();
			const genre = await Genre.find({name: 'genre1'});

			expect(genre).not.toBeNull();
			expect(res.status).toBe(200);
		});

		it('Should return the genre if it is valid', async() => {
			res = await executeRequest();

			expect(res.body).toHaveProperty('_id');
			expect(res.body).toHaveProperty('name', 'genre1');
			expect(res.status).toBe(200);
		});

	});
});