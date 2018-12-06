const mongoose = require('mongoose');
const Schema = require ('mongoose/lib/schema');

mongoose.connect('mongodb://localhost/mongo-demo')
	.then(console.log('Connected'))
	.catch(err => console.log('Not connected cause: ',err));

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		// match: /pattern/ //regex
	},
	cathegory: {
		type: String,
		required: true,
		enum: ['web', 'mobile', 'network'],
		lowercase: true // Sets the value to lowecase automatically
		// uppercase: true,
		// trim: true
	},
	author: String,
	price: {
		type: Number,
		required: function(){return this.isPublished}, //cant use arrow functions here
		min: 10,
		max: 200,
		get: value => Math.round(value),
		set: value => Math.round(value)
	},
	tags: {
		type: Array,
		validate: {
			isAsync: true,
			validator: function(value, callback){ // Custom validator (remove callback and return result if not async)
				setTimeout(() => { // Remove if not async
					//Async work
					const result = value && value.length > 0;
					callback(result);
				}, 3000);

			},
			message: 'A course should have at list one tag'
		}
	}, //required will force array, but still can pass a empty one
	date: {type: Date, default: Date.now()},
	isPublished: Boolean
});

const Course = mongoose.model('Course', schema);

async function createCourse(){
	const course = new Course({
		name: 'React Course', // Required so cant save in DB
		cathegory: 'Web',
		author: 'Mateus',
		tags: ['frontend'],
		isPublished: true,
		price: 15.8
	});

	try{
		const resut = await course.save();
		console.log(resut);
	}catch(ex){
		for(field in ex.errors)
			console.log(ex.errors[field].message);
	}

}

createCourse();