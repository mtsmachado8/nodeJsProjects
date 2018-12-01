console.log('Before');
getUser(1, getRepositories1);

console.log('After');

function getUser(id, callback){
	console.log('getUser 2 id:', id);
	console.log('getUser 2 callback:', callback);

	setTimeout(() => {
		console.log('Reading from db');
		callback({ id: id, githubUsername: 'mosh'});
	}, 2000);
}

function getRepositories1(user){
	console.log('getRepositories 1 user:', user);
	getRepositories(user.githubUsername, getCommits1);
}

function getRepositories(username, callback){
	console.log('getRepositories 2 username:', username);
	console.log('getRepositories 2 callback:', callback);

	setTimeout(() => {
		console.log('Reading from db');
		callback(['repo1', 'repo2']);
	}, 2000);
}

function getCommits1(repos){
	console.log('getCommits 1 repo:', repos);
	getCommits(repos, displayCommits);
}

function getCommits(repos, callback){
	console.log('getCommits 2 repo:', repos);
	console.log('getCommits 2 callback:', callback);

	setTimeout(() => {
		console.log('Reading from db');
		callback(repos);
	}, 2000);
}

function displayCommits(commits){
	console.log('displayCommits 1 commits:', commits);
}