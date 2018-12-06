// Trade off between query performance vc consistency

// Using References (Normalization) -> CONSISTENCY, if change a object all will change
let author = {
	name: 'Mosh Hamedani'
};

let course = {
	author: 'id'
};

// Using Embedded Documents (Denormalization) -> PERFORMANCE, loads with a single query
let course = {
	author: {
		name: 'Moshs'
	}
};


//Hybrid
let author = {
	name: 'Mosh'
	//50 other props
};

let course = {
	author: {
		id: 'ref',
		name: 'Mosh'
	}
};