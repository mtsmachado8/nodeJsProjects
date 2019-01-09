const request = require('supertest');
const { User } = require('../../models/user');
let server;


describe('Auth middleware', () => {
	beforeEach(() => { server = require('../../index'); });
	afterEach(async() => {
		server.close();
	});

	let token;

	const executeRequest = () => {
		return request(server)
			.post('/api/genres')
			.set('x-auth-token', token)
			.send({name: 'genre1'})
	};

	beforeEach(() => {
		token = new User().generateAuthToken();
	});

	it('Should return 400 if token is invalid', async() => {
		token = '';
		const res = await executeRequest();

		expect(res.status).toBe(400);
	});

	it('Should return 401 if no token is provided', async() => {
		token = '';
		const res = await executeRequest();

		expect(res.status).toBe(401);
	});

	it('Should return 200 if token is valid', async() => {
		const res = await executeRequest();

		expect(res.status).toBe(200);
	});
});