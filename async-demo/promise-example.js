const p = new Promise((resolve, reject) => {
	//kick off async work

	setTimeout(() => {
		// resolve(1); //pendig => resolved, fullfilled
		reject(new Error('message')) // pending => rejected

	}, 2000);

});

p.then(result => console.log('Result', result)).catch(err => console.log('Error: ',err.message));