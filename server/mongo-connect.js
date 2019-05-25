const mongoose = require("mongoose");
const chalk = require("chalk");

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
		console.log(
			chalk.green.bold("[Database] "),
			"MongoDB Connected at",
			chalk.underline(
				"http://" +
					mongoose.connection.host +
					":" +
					mongoose.connection.port +
					"/" +
					mongoose.connection.name +
					"\n"
			)
		);
		return connection;
	} catch (err) {
		console.log(chalk.red.bold("[Error] "), err);
		return err;
	}
};

module.exports = dbconnect;
