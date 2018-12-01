

// getCustomer(1, (customer) => {
//   console.log('Customer: ', customer);
//   if (customer.isGold) {
//     getTopMovies((movies) => {
//       console.log('Top movies: ', movies);
//       sendEmail(customer.email, movies, () => {
//         console.log('Email sent...')
//       });
//     });
//   }
// });
sendEmailToGoldCustomers();

async function sendEmailToGoldCustomers(){
   const customer = await getCustomer(1);
   if(customer.isGold){
		const topMovies = await getTopMovies();
		const str = await sendEmail(customer.email, topMovies)
		console.log(str);
	}else
		console.log('customer isnt Gold, so didnt send an email');
}

function getCustomer(id) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				id: 1,
				name: 'Mosh Hamedani',
				isGold: true,
				email: 'email'
			});
		}, 1000);
	});
}

function getTopMovies() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(['movie1', 'movie2']);
		}, 1000);
   });

}

function sendEmail(email, movies) {
  return new Promise((resolve, reject) => {
	  setTimeout(() => {
	    const str = 'sending movies: '+ movies + ' to email: ' +email;
		  resolve(str);
	  }, 1000);
  });
}