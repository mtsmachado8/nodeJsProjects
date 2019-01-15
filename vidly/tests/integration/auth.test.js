const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');
let server;


describe('Auth middleware', () => {
	beforeEach(async () => {
		server = await require('../../index');
		token = await new User({isAdmin: true}).generateAuthToken();
	});
	afterEach(async() => {
		await Genre.remove({});
		await server.close();
	});

	let token;

	const executeRequest = () => {
		return request(server)
			.post('/api/genres')
			.set('x-auth-token', token)
			.send({name: 'genre1'})
	};

	it('Should return 400 if token is invalid', async() => {
		token = 'a';
		const res = await executeRequest();
		expect(res.status).toBe(400);
	});

	it('Should return 401 if no token is provided', async() => {
		token = '';
		const res = await executeRequest();

		expect(res.status).toBe(401);
	});

	it('Should return 403 if not authorized (user is not admin)', async() => {
		token = await new User().generateAuthToken();
		const res = await executeRequest();

		expect(res.status).toBe(403);
	});

	it('Should return 200 if token is valid', async() => {
		token = await new User({isAdmin: true}).generateAuthToken();
		const res = await executeRequest();
		console.log(res.body);
		expect(res.status).toBe(200);
	});
});