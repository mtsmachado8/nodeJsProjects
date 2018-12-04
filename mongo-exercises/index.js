const mongoose = require('mongoose');
const Schema = require ('mongoose/lib/schema');

mongoose.connect('mongodb://localhost/mongo-demo')
	.then(console.log('Connected'))
	.catch(err => console.log('Not connected cause: ',err));

const schema = new mongoose.Schema({
	name: String,
	author: String,
	price: Number,
	tags: [String],
	date: {type: Date, default: Date.now()},
	isPublished: Boolean
});

const Course = mongoose.model('Course', schema);

async function createCourse(){
	const course = new Course({
		name: 'React Course',
		author: 'Mateus',
		tags: ['react', 'frontend'],
		isPublished: true,
		price: 190
	});
	const resut = await course.save();
	console.log(resut);
}

async function getPublishedCourses(){
	return await Course
		.find({isPublished: true})
		.find({tags: 'backend'})
		.sort('name') // or {name: 1}
		.select('name author'); // or {name: 1, author: 1}
}

async function getMostExpensiveCoursesOfTypes(options){
	return await Course
		.find({isPublished: true, tags:{$in: options}})
		// .or([{tags: 'frontend'}, {tags: 'backend'}]) // or let find() with isPublished and add this line
		.sort('-price') // or {price: -1}
		.select('name author price tags'); // or {name: 1, author: 1}
}

async function getCoursesByPriceGteOrNameBy(pc){
	return await Course
		.find({isPublished: true})
		.or([
			{price: {$gte: pc}},
			{name: /.*by.*/i}
		])
		.sort('-price') // or {price: -1}
		.select('name author price'); // or {name: 1, author: 1}
}

async function getCourseById(id){
	return await Course.findById(id);
}

async function updateCourse(id){

	// const course = await Course.findById(id);
	//or
	// return await Course.update({_id: id}, {
	// 	$set:{
	// 		author: 'Mosh',
	// 		isPublished: false
	// 	}
	// });
	//or
	return await Course.findByIdAndUpdate(id, {
		$set:{
			author: 'Jack',
			isPublished: true
		}
	}, {new: true});

	// if(!course) return;
	// if(course.isPublished) return;

	// course.isPublished = true;
	// course.author = 'Another Author';

	// return await course.save();

	// Optional Approach
	// course.set({
	// 	isPublished: true,
	// 	author: 'Another Author'
	// });
}

async function removeCourse(id){
	return await Course.deleteOne({ _id: id});
	// return await Course.deleteMany({ _id: id});
	// return await Course.findByIdAndRemove(id);
}

async function run(){
	// const courses = await getMostExpensiveCoursesOfTypes(['express', 'backend']);
	// const courses = await getCoursesByPriceGteOrNameBy(15);
	const old_course = await getCourseById('5c06e41267dd113dfc223da0');
	const new_course = await updateCourse('5c06e41267dd113dfc223da0');
	const removed = await removeCourse('5c06e41267dd113dfc223da0');

	// await createCourse();
	console.log('old course: ',old_course);
	console.log('new course: ',new_course);
	console.log('removed:', removed);
}

run();