const mongoose = require("mongoose");
const chalk = require("chalk");
const http = require("http");
const request = require("supertest");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = require("../app");
let server = null;

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

const course = {
	getCourses: {
		route: "/api/v1/courses",
		resolver: async () => {
			let response = await request(server).get(course.getCourses.route);
			console.log("GET :", response.body);
			expect(response.status).toEqual(200);
			expect(response.body.data).toBeDefined();
			expect(response.type).toEqual("application/json");
			expect(response.body.data).toEqual(
				expect.arrayContaining([]) ||
					expect.arrayContaining([
						expect.objectContaining({
							_id: expect.anything(),
							course_id: expect.anything(),
							course_title: expect.anything(),
							credits: expect.anything(),
							semester: expect.anything()
						})
					])
			);
		}
	},
	addCourse: {
		route: "/api/v1/courses",
		data: {
			course_id: "17MCA201",
			course_title: "Python Programming",
			credits: 4,
			year: 2018,
			semester: 4
		},
		resolver: async () => {
			let response = await request(server)
				.post(course.addCourse.route)
				.send(course.addCourse.data);
			expect(response.status).toEqual(200);
			expect(response.body.data).toBeDefined();
			expect(response.type).toEqual("application/json");
			expect(response.body.data).toEqual(
				expect.arrayContaining([]) ||
					expect.arrayContaining([
						expect.objectContaining({
							_id: expect.anything(),
							course_id: expect.anything(),
							course_title: expect.anything(),
							credits: expect.anything(),
							semester: expect.anything()
						})
					])
			);
		}
	},
	getCourse: {
		route: "/api/v1/courses/17mca201",
		expectData: {
			course_id: "17MCA201",
			course_title: "Python Programming",
			credits: 4,
			year: 2018,
			semester: 4
		},
		resolver: async () => {
			let response = await request(server).get(
				`/api/v1/courses/${course.getCourse.expectData.course_id}`
			);
			expect(response.status).toEqual(200);
			expect(response.body.data).toBeDefined();
			expect(response.type).toEqual("application/json");
			expect(response.body.data).toEqual(
				expect.arrayContaining(
					[] ||
						expect.arrayContaining([
							expect.objectContaining({
								_id: expect.anything(),
								course_id:
									course.getCourse.expectData.course_id,
								course_title:
									course.getCourse.expectData.course_title,
								credits: course.getCourse.expectData.credits,
								semester: course.getCourse.expectData.semester,
								year: course.getCourse.expectData.year
							})
						])
				)
			);
		}
	},
	updateCourse: {
		route: "/api/v1/courses/17mca201",
		data: {
			file: (() => {
				return fs.readFileSync(
					"/home/velansalis/Documents/MCA 4 SEM C-LAB.xls"
				);
			})(),
			course_title: "Python",
			details: {
				usn: "4nm18mca97"
			}
		},
		expectData: {},
		resolver: async () => {
			let response = await request(server)
				.patch("/api/v1/courses/17mca201")
				.send(course.updateCourse.data);
			console.log(response.body);
			expect(response.status).toEqual(200);
			expect(response.body.data).toBeDefined();
			expect(response.type).toEqual("application/json");
			expect(response.body.data).toEqual(expect.arrayContaining([]));
		}
	}
};

describe("Courses", () => {
	test(`GET : ${course.getCourses.route}`, course.getCourses.resolver);
	test(`POST : ${course.addCourse.route}`, course.addCourse.resolver);
	test(`GET : ${course.getCourse.route}`, course.getCourse.resolver);
	test(`GET : ${course.getCourses.route}`, course.getCourses.resolver);
	test(`PATCH : ${course.updateCourse.route}`, course.updateCourse.resolver);
	test(`GET : ${course.getCourses.route}`, course.getCourses.resolver);
	test(`GET : ${course.getCourses.route}`, course.getCourses.resolver);
});
