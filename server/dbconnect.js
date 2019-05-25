const mongoose = require("mongoose");

// Switching off deprecation warnings
const options = {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true
};

const dbconnect = function() {
	mongoose
		.connect(process.env.MONGO_URL, options)
		.then(res => {
			console.log(
				`[MONGODB] database Successfully Connected - url : [${
					process.env.MONGO_URL
				}]`
			);
		})
		.catch(err => {
			console.log("There was an error connecting database.");
		});
};

module.exports = dbconnect;
