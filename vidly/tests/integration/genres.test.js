const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
	beforeEach( async() => { server = await require('../../index'); });
	afterEach( async() => {
		await Genre.deleteMany({}); //remove all genres
		await server.close();
	});

	describe('GET /', () => {
		it('Return all genres', async() => {
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
		it('Return a specific genre if valid id', async() => {
			const genre = new Genre({name: 'genre1'});
			await genre.save();

			const res = await request(server).get('/api/genres/' + genre._id);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('name', genre.name);
		});

		it('Return a 404 error if invalid id', async() => {
			const res = await request(server).get('/api/genres/1');

			expect(res.status).toBe(404);
		});

		it('Return a 404 error if no genre with the given id exists', async() => {
			const id = mongoose.Types.ObjectId();
			const res = await request(server).get('/api/genres/'+ id);

			expect(res.status).toBe(404);
		});
	});

	describe('DELETE /:id', () => {
		// Define the happy path, and in each test, change one paramether
		// that clearly align with the name of the test

		let token;
		let genre;
		let id;

		let res;

		const executeRequest = async() => {
			return await request(server)
				.delete('/api/genres/' + id)
				.set('x-auth-token', token)
				.send();
		};

		beforeEach(async() => {
			// Before each test we need to create a genre and
			// put it in the database.
			genre = new Genre({name: 'genre1'});
			await genre.save();

			id = genre._id;
			token = await new User({isAdmin: true}).generateAuthToken(); // Generating an admin token to every test
		});

		it('Delete a genre from BD if allowed', async() => {
			res = await executeRequest();

			const genreInDb = await Genre.findById(id);
			expect(genreInDb).toBeNull();
		});

		it('Return a deleted genre', async() => {
			res = await executeRequest();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('_id', id.toHexString());
			expect(res.body).toHaveProperty('name', genre.name);
		});

		it('Return 403 if the user is not an admin', async () => {
			token = await new User({ isAdmin: false }).generateAuthToken();

			const res = await executeRequest();

			expect(res.status).toBe(403);
		});

		it('Return 404 if no genre with the given id was found in BD', async() => {
			id = mongoose.Types.ObjectId();

			res = await executeRequest();
			expect(res.status).toBe(404);
		});

		it('Return 401 if not logged in', async() => {
			token = ''; // Don't have a login token

			res = await executeRequest();
			expect(res.status).toBe(401);
		});

		it('Return 400 if invalid token', async() => {
			token = 1; // Have a Invalid login token

			res = await executeRequest();
			expect(res.status).toBe(400);
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

		it('Return a 401 if client is not logged in', async() => {
			token = ''; // Don't have a login token

			res = await executeRequest();
			expect(res.status).toBe(401);
		});

		it('Return a 403 if the logged user is logged but not an admin', async() => {
			token = await new User({isAdmin: false}).generateAuthToken();

			res = await executeRequest();
			expect(res.status).toBe(403);
		});

		it('Return a 400 if genre is less than 5 characteres', async() => {
			name = '1234';

			res = await executeRequest();
			expect(res.status).toBe(400);
		});

		it('Return a 400 if genre is more than 50 characteres', async() => {
			name = new Array(52).join('a'); //Big name

			res = await executeRequest();
			expect(res.status).toBe(400);
		});

		it('save the genre if it is a valid one', async() => {
			res = await executeRequest();
			const genre = await Genre.find({name: 'genre1'});

			expect(genre).not.toBeNull();
			expect(res.status).toBe(200);
		});

		it('Return the genre if it is valid', async() => {
			res = await executeRequest();

			expect(res.body).toHaveProperty('_id');
			expect(res.body).toHaveProperty('name', 'genre1');
			expect(res.status).toBe(200);
		});

	});

	describe('PUT /:id', () => {
		// Define the happy path, and in each test, change one paramether
		// that clearly align with the name of the test
		let token;
		let name;
		let id;

		let res;

		beforeEach(async() => {
			// Use a new user token
			const user = new User({isAdmin:true});
			token = await user.generateAuthToken();

			const genre = new Genre({name: 'genre1'});
			await genre.save();

			name = 'NewName';
			id = genre._id;
		});

		const executeRequest = async() => {
			return await request(server)
				.put('/api/genres/' + id)
				.set('x-auth-token', token)
				.send({name});
		};

		it('Returns a updated genre if allowed', async() => {
			res = await executeRequest();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('_id', id.toHexString());
			expect(res.body).toHaveProperty('name', name);
		});

		it('update the genre if input is valid', async () => {
			await executeRequest();

			const updatedGenre = await Genre.findById(id);

			expect(updatedGenre.name).toBe(name);
		});

		it('Return a 401 if client is not logged in', async() => {
			token = ''; // Don't have a login token

			res = await executeRequest();
			expect(res.status).toBe(401);
		});

		it('Return a 403 if the logged user is logged but not an admin', async() => {
			token = await new User({isAdmin: false}).generateAuthToken();

			res = await executeRequest();
			expect(res.status).toBe(403);
		});

		it('Return 404 if no genre with the given id was found in BD', async() => {
			id = mongoose.Types.ObjectId();

			res = await executeRequest();
			expect(res.status).toBe(404);
		});

		it('Return 404 if the given id is invalid', async() => {
			id = 1;

			res = await executeRequest();
			expect(res.status).toBe(404);
		});

		it('Return a 400 if genre is less than 5 characteres', async() => {
			name = '1234';

			res = await executeRequest();
			expect(res.status).toBe(400);
		});

		it('Return a 400 if genre is more than 50 characteres', async() => {
			name = new Array(52).join('a'); //Big name

			res = await executeRequest();
			expect(res.status).toBe(400);
		});
	});

	});