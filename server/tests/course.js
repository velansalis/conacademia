const request = require("supertest");
const fs = require("fs");
const path = require("path");

const course = {
	getCourses: {
		route: "/api/v1/courses",
		resolver: async () => {
			let response = await request(server).get(course.getCourses.route);
			expect(response.status).toEqual(200);
			expect(response.body.data).toBeDefined();
			expect(response.type).toEqual("application/json");
			expect(response.body.data).toEqual(
				expect.arrayContaining([]) ||
					expect.arrayContaining([expect.objectContaining({})])
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
		route: "api/v1/courses/17mca201",
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
	}
};

module.exports = course;
