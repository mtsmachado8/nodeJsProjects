const express = require('express');
const Joi = require('joi');
const router = express.Router();

const courses = [
	{ id: 1, name: 'course1' },
	{ id: 2, name: 'course2' },
	{ id: 3, name: 'course3' },
];

router.get('/', (req, res) => {
	res.send(courses);
});

router.post('/', (req,res) => {
	const { error } = validateCourse(req.body); //result.error

	if(error)
		return res.status(400).send(error.details[0].message);


	const course = {
		id: courses.length + 1,
		name: req.body.name
	};

	courses.push(course);
	res.send(course);
});

router.put('/:id', (req,res) => {
	//Look up the course
	//if not existing, return 404
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if(!course)
		return res.status(404).send('The course with the given id doenst exists');

	//Validate
	//If invalid, return 400 - Bad request
	const { error } = validateCourse(req.body); //result.error

	if(error)
		return res.status(400).send(error.details[0].message);


	//Udate course
	course.name = req.body.name;
	res.send(course)
});

router.get('/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if(!course)
		return res.status(404).send('The course id was not found');

	res.send(course);
});

router.delete('/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if(!course)
		res.status(404).send('The course with the given id doenst exists');

	courses.splice(courses.indexOf(course), 1);

	res.send(courses);

});

function validateCourse(course){
	return Joi.validate(course, { name: Joi.string().min(3).required() });
}

module.exports = router;