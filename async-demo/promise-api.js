const fb_api = new Promise((resolve) => {
	setTimeout(() => {
		console.log('async');
		resolve(1);
	},2000);
});

const gg_api = new Promise((resolve) => {
	setTimeout(() => {
		console.log('async 2');
		resolve(2);
	},2000);
});

// Promise.all([fb_api,gg_api])
// 	.then(res => console.log(res))
// 	.catch(err => console.log(err.message));

// -The first one getting here will be executed
Promise.race([fb_api,gg_api])
	.then(res => console.log(res))
	.catch(err => console.log(err.message));