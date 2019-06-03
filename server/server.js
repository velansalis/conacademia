const chalk = require("chalk");
const mongoose = require("mongoose");
const server = require("http");
require("dotenv").config();

const app = require("./app");

(async () => {
	try {
		await mongoose.connect(
			`${process.env.MONGO_URL}/${process.env.DB_NAME}`,
			{
				useNewUrlParser: true,
				useFindAndModify: false,
				useCreateIndex: true
			}
		);
		server.createServer(app).listen(process.env.PORT, () => {
			console.table({
				database: "Mongodb : 27017",
				server: `NodeJS : ${process.env.PORT}`,
				name: require("./package.json").name,
				version: require("./package.json").version,
				author: require("./package.json").author,
				license: require("./package.json").license
			});
		});
	} catch (err) {
		console.log(chalk.red.bold("[Error] "), err);
		throw err;
	}
})();

process.on("SIGINT", async () => {
	console.log("\n");
	console.log(
		chalk.green.bold("Mongoose : "),
		chalk.red.bold("Connection Closed")
	);
	mongoose.connection.close();
	process.exit();
});
