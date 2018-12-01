
console.log('Before');

// -Promise based approach
// 	getUser(1)
// 		.then(user => getRepositories(user))
// 		.then(repos => getCommits(repos))
// 		.then(comits => console.log(comits))
// 		.catch(e => console.log(e.message));

// -Async and await approach
async function displayCommits(){
	try{
		const user = await getUser(1);
		const repos = await  getRepositories(user);
		const commits = await getCommits(repos[1]);
		console.log('commits: ', commits);
	}catch(e){
		console.log(e);
	}

}

displayCommits();


console.log('After');

function getUser(id){
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('Reading user from db');
			const user = { id: id, githubUsername: 'mosh'};
			resolve(user);

		}, 2000);
	});
}

function getRepositories(user){
	return new Promise( (res, reject) => {
		setTimeout(() => {
			console.log('Reading repositories from db');
			// res(['repo1', 'repo2']);
			reject(new Error('Deu ruim hein'))
		}, 2000);
	});

}

function getCommits(repos){
	return new Promise( (res, reject) => {
		setTimeout(() => {
			console.log('Reading commits from db');
			res(['commit 1', 'commit 2']);
		}, 2000);

	});
}