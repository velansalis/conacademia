const mongoose = require("mongoose");

const options = {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true
};

const dbconnect = async () => {
	try {
		const connection = await mongoose.connect(
			process.env.MONGO_URL,
			options
		);
		console.log("Connected");
		return connection;
	} catch (err) {
		console.log("There was an error connecting database.");
		return err;
	}
};

module.exports = dbconnect;
