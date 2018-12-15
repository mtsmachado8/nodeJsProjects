const mongoose = require('mongoose');

const id = new mongoose.Types.ObjectId();
console.log(id);
console.log(id.getTimestamp());

const valid = mongoose.Types.ObjectId.isValid('123');
console.log(valid);
// _id 5c0e46833eb0e83394175cc9

// 12 Bytes - 24 digits
	// firts 4 Bytes - tymestamp
	// So we dont have to use a createdAt;
	// 3 bytes: machine identifier
	// 2 bytes: process identifier
	// 3 bytes: counter

// 1 byte: 8 bits
// 2^8 = 256 numbers
// 2^24 = 16Milion

// Driver generate the id
// MongoDB Driver -> MongoDB