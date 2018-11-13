const fs = require('fs');

const files = fs.readdirSync('./'); //Syncronous way. Don't use it

fs.readdir('./', (error, files) => {
	if(error)
		console.log('Error: ',error)
	else
		console.log('Result: ',files);

});