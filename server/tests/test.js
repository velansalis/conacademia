const request = require("supertest");
require("dotenv").config();

let app = require("../app");
let db = require("../mongo-connect");

beforeAll(async done => {
	db = await db.call();
	app = app.listen(process.env.PORT, () => {
		global.agent = request.agent(app);
		done();
	});
});

describe("Students", () => {
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
	await app.close();
	await db.disconnect();
	done();
});
