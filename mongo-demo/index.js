const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
	.then(() => console.log('Connected to MongoDb'))
	.catch(err => console.error('Cound not connect to MongoDB ',err));

const courseSchema = new mongoose.Schema({
	name: String,
	author: String,
	tags: [String],
	date: { type: Date, default: Date.now },
	isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);


async function createCourse(){
	const course = new Course({
		name: 'React Course',
		author: 'Mateus',
		tags: ['react', 'frontend'],
		isPublished: true
	});
	const resut = await course.save();
	console.log(resut);
}

async function getCourses(){
	// eq 	(equal)
	// ne 	(not equal)
	// gt 	(greater than)
	// gte	(greater than or equal to)
	// lt		(less than)
	// lte 	(less than or equal to)
	// in 	(in)
	// nin	(not in)

	// Logical Operators
	// or
	// and

	// Pagination
	const pageNumber = 2;
	const pageSize = 10;
	// /api/courses?pageNumber=2&pageSize=10

	const courses = await Course
		// .find({ price: { $gte: 10, $lte: 20 } }) // $ to indicate an operator
		// .find({ price: { $in: [10,15,20] } }) // One of its values
		// .find() // use it with logical operator
		// .and([]) // And logical operator
		// .or( [{ author: 'Mateus'}, {isPublished: true }])
		// .find( { author: /^Mat/}) //Regex to author starting with Mat
		// .find( {author: /Machado$/i }) //Regex to author ending with Machado (i = insensitive case)
		// .find( {author: /.*Mat.*/i }) // Regex contains Mat
		.find( {author: 'Mateus', isPublished: true})
		// .skip((pageNumber -1) * pageSize) // Pagination
		.limit(pageSize)
		.sort({ date: 1 }) //1 is ascending order. -1 is descending
		.count();
		// .select( {name: 1, tags: 1});

	console.log(courses);
}

getCourses();
