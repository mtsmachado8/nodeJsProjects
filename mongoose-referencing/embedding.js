const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
	name: String,
	bio: String,
	website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
	name: String,
   authors: {
		type: [authorSchema],
		required: true
	} // Embeding
}));

async function createCourse(name, authors){
	try{
		const course = new Course({
			name,
			authors: authors
		});

		const result = await course.save();
		console.log(result);
		console.log(result._id);
		return result._id;
	}catch(e){
		console.error(e.message);
	}
}

async function listCourses(){
	const courses = await Course.find();
	console.log(courses);
}

async function updateAuthor(courseId){
	try{
		// const course = await Course.findById(courseId);
		// course.author.name = 'Mosh Hamedani';
		// const new_course = await course.save();

		const new_course = await Course.update({_id: courseId}, {
			// $set: {
			// 	'author.name': 'John Smith'
			// }
			// $unset: {
			// 	'author': ''
			// }
		});
		console.log('new_course: ',new_course);
	}catch(e){
		console.error(e.message)
	}
}

async function addAuthor(courseId, author){
	const course = await Course.findById(courseId)
	course.authors.push(author);
	await course.save();
}

async function removeAuthor(course_id, author_id){
	try{
		const course = await Course.findById(course_id);
		if(!course) throw new Error('Couldn\'t find this course');
		
		const author = await course.authors.id(author_id);
		if(!author) throw new Error('Couldn\'t find this author');

		await author.remove();
		await course.save();
		console.log('removed');
	}catch(e){
		console.log(e.message);
	}
}


async function run(){
	// const course_id = await createCourse('Node Course', [
	// 	new Author({ name: 'Mosh' }),
	// 	new Author({ name: 'Mateus'})
	// ]);
	// await addAuthor('5c091f22e1c1601d20ab5357', new Author({name: 'Amy'}));
	await removeAuthor('5c091f22e1c1601d20ab5357', '5c092030f71f17424ceb5c26');
	// await updateAuthor(course_id);
}
run();
