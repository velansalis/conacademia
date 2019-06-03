const mongoose = require("mongoose");
const chalk = require("chalk");
const http = require("http");
const request = require("supertest");
const fs = require("fs");
const path = require("path");

let server = null;
const app = require("../app");

require("dotenv").config();

beforeAll(async done => {
	try {
		jest.setTimeout(10000);
		await mongoose.connect(
			`${process.env.MONGO_URL}/${process.env.TEST_DB_NAME}`,
			{
				useNewUrlParser: true,
				useFindAndModify: false,
				useCreateIndex: true
			}
		);
		server = http
			.createServer(app.callback())
			.listen(process.env.TEST_PORT, () => {
				console.log(chalk.bold.white("Test Started"));
			});
		done();
	} catch (err) {
		console.log(chalk.red.bold("[Error] "), err);
		throw err;
	}
});

afterAll(async done => {
	await server.close();
	await mongoose.connection.db.dropDatabase();
	await mongoose.connection.close();
	console.log(
		chalk.green.bold("Mongoose : "),
		chalk.red.bold("Connection Closed")
	);
	done();
});

describe("Courses", () => {
	test("Returning all courses", async () => {
		let response = await request(server).get("/api/v1/courses/");
		expect(response).toBeDefined();
		expect(response.status).toEqual(200);
		expect(response.type).toEqual("application/json");
		expect(response.body.data).toEqual(
			expect.arrayContaining([]) ||
				expect.arrayContaining([expect.objectContaining({})])
		);
	});

	test("Add a new course", async () => {
		let data = {
			course_id: "17MCA201",
			course_title: "Python Programming",
			credits: 4,
			year: 2018,
			semester: 4
		};
		let response = null;
		response = await request(server)
			.post("/api/v1/courses")
			.send(data);
		expect(response).toBeDefined();
		expect(response.status).toEqual(200);
		expect(response.type).toEqual("application/json");
		expect(response.body.data).toEqual(
			expect.arrayContaining([]) ||
				expect.arrayContaining([
					expect.objectContaining({
						_id: expect.anything(),
						course_id: expect.anything(),
						course_title: expect.anything()
					})
				])
		);
		response = await request(server).get("/api/v1/courses/17mca201");
		expect(response).toBeDefined();
		expect(response.status).toEqual(200);
		expect(response.type).toEqual("application/json");
		expect(response.body.data).toEqual(
			expect.arrayContaining([]) ||
				expect.arrayContaining([
					expect.objectContaining({
						course_id: data.course_id,
						course_title: data.course_title,
						credits: data.credits,
						semester: data.semester,
						year: data.year
					})
				])
		);
	});

	test("Edit registered course", async () => {
		let reponse = null;
		let filePath = "/home/velansalis/Documents/MCA 4 SEM C-LAB.xls";
		let file = fs.readFileSync(filePath);

		let query = {
			query: {
				file: file,
				course_title: "Python",
				details: {
					usn: "4nm18mca97"
				}
			}
		};

		response = await request(server)
			.patch("/api/v1/courses/17mca201")
			.send(query);
		expect(response).toBeDefined();
		expect(response.status).toEqual(200);
		expect(response.type).toEqual("application/json");
		expect(response.body.data).toEqual(expect.arrayContaining([]));
		response = await request(server).get("/api/v1/courses/17mca201");
		expect(response).toBeDefined();
		expect(response.status).toEqual(200);
		expect(response.type).toEqual("application/json");
		expect(response.body.data).toEqual(
			expect.arrayContaining([]) ||
				expect.arrayContaining([
					expect.objectContaining({
						xlfile1_name: expect.toBe(String),
						course_title: query.query.course_title
					})
				])
		);
	});

	test("Delete single registered course", async () => {
		let response = await request(server).delete("/api/v1/courses/17mca201");
		expect(response).toBeDefined();
		expect(response.status).toEqual(200);
		expect(response.type).toEqual("application/json");
		expect(response.body.data.deletedCount).toEqual(1);
	});
});
