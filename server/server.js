const chalk = require("chalk");
const mongoose = require("mongoose");
const server = require("http");
const app = require("./app");

require("dotenv").config();

app.on("error", err => {
	console.error("server error", err);
});

server.createServer(app.callback()).listen(process.env.PORT, () => {
	// console.clear();
	console.log(
		chalk.blue.bold("[App Name] "),
		require("./package.json").name,
		"\n"
	);
	console.log(
		chalk.green.bold("[Version] "),
		require("./package.json").version
	);
	console.log(
		chalk.green.bold("[Server] "),
		`Node Connected at ${process.env.PORT}`
	);
});

process.on("SIGINT", async () => {
	console.log(mongoose.connection.readyState);
	mongoose.connection.close();
	process.exit();
});
