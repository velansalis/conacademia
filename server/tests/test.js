const request = require("supertest");
const mongoose = require("mongoose");
const chalk = require("chalk");

let server = require("http");

require("dotenv").config();

let app = require("../app");

function logInformation(descriptor, name, status, port) {
	if (status && port) {
		console.log(
			chalk.bold(descriptor),
			chalk.white.underline(name),
			":",
			chalk.blue.bold(port),
			status ? chalk.bold.green("Connected") : chalk.bold.red("Error")
		);
	} else {
		console.log(chalk.bold(descriptor), chalk.white.underline(name));
	}
}

beforeAll(async done => {
	(async () => {
		try {
			await mongoose.connect(
				`${process.env.MONGO_URL}/${process.env.TEST_DB_NAME}`,
				{
					useNewUrlParser: true,
					useFindAndModify: false,
					useCreateIndex: true
				}
			);
			server = server
				.createServer(app.callback())
				.listen(process.env.TEST_PORT, () => {
					logInformation("Database", "MongoDB", true, 27017);
					logInformation(
						"Server",
						"Nodejs",
						true,
						process.env.TEST_PORT
					);
					logInformation("API Name", require("../package.json").name);
					logInformation(
						"API Version",
						require("../package.json").version
					);
				});
		} catch (err) {
			console.log(chalk.red.bold("[Error] "), err);
			throw err;
		}
	})();
});

describe("Course", () => {
	test("Should Return all the registered Students", async () => {
		const response = await request(app).get("/api/student");
		expect(response).toBeDefined();
		expect(response.status).toEqual(200);
		expect(response.type).toEqual("application/json");
		expect(response.body).toMatchObject({
			data: [
				{
					username: expect.anything()
				}
			]
		});
	});
});

afterAll(async done => {
	await server.close();
	await mongoose.connection.disconnect();
	done();
});
