const lib = require('../lib');

describe('absolute', () => {

	it('Should return positive number if input is positive', () => {
		const result = lib.absolute(1);
		expect(result).toBe(1);
	});

	it('Should return positive number if input is negative', () => {
		const result = lib.absolute(-1);
		expect(result).toBe(1);
	});

	it('Should return 0 if input is 0', () => {
		const result = lib.absolute(0);
		expect(result).toBe(0);
	});

});

describe('greet', () => {

	it('Should return the greeting message', () => {
		const result = lib.greet('Mateus');
		expect(result).toMatch(/Mateus/);
		expect(result).toContain('Mateus');

	});

});

describe('getCurrencies', () => {

	it('Should return supported currencies', () => {
		const result = lib.getCurrencies();

		// Not too general (testing not null f.e)
		// Not too specific (cant change or break test)

		// Way of doing it
		// expect(result).toContain('USD');
		// expect(result).toContain('AUD');

		// Ideal Way
		expect(result).toEqual(expect.arrayContaining(['USD','AUD','EUR']));

	});

});

describe('getProduct', () => {

	it('Should return the product with the given id', () => {
		// expect(lib.getProduct(1)).toEqual({id: 1, price: 10}); // Check all properties

		expect(lib.getProduct(1)).toMatchObject({id: 1, price: 10}); // Don't check all properties

		expect(lib.getProduct(1)).toHaveProperty('id', 1); // Don't check all properties

	});

});

describe('registerUser', () => {

	it('Should throw if user is falsy', () => {
		const args = [null, undefined, NaN, '', false, 0];

		args.forEach(arg => {
			expect(() => {
				lib.registerUser(arg)
			}).toThrow();
		});

	});

	it('Should return a user if valid username', () => {
		const result = lib.registerUser('mosh');
		expect(result).toMatchObject({username: 'mosh'});
		expect(result.id).toBeGreaterThan(0);
	});
});