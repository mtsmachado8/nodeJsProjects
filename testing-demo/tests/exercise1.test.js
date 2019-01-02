const exercise = require('../exercise1');

describe('fizzbuzz exercise', () => {

	it('Should throw if typeof input !== number', () => {
		const args = [null, undefined, '', false, NaN];

		args.forEach(arg => {
			expect(() => {exercise.fizzBuzz(arg)}).toThrow();
		});

	});

	it('Should return FizzBuzz if divisible by 3 or 5', () => {
		const args = [15];

		args.forEach(arg => {
			expect(exercise.fizzBuzz(arg)).toBe('FizzBuzz');
		});
	});

	it('Should return Fizz if only divisible by 3', () => {
		const args = [3, 6];

		args.forEach(arg => {
			expect(exercise.fizzBuzz(arg)).toBe('Fizz');
		});
	});

	it('Should return Buzz only divisible by 5', () => {
		const args = [5, 10];

		args.forEach(arg => {
			expect(exercise.fizzBuzz(arg)).toBe('Buzz');
		});
	});

	it('Should return input otherwise', () => {
		const args = [1, 2, 4];

		args.forEach(arg => {
			expect(exercise.fizzBuzz(arg)).toBe(arg);
		});
	});
});