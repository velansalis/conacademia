const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const { Student, Faculty } = require("../../models/index");

const generateToken = data => {
	return new Promise((resolve, reject) => {
		jwt.sign(data, process.env.PRIVATE_KEY, { expiresIn: 60 * 60 * 24 }, (err, token) => {
			if (err) {
				reject(err);
			} else {
				resolve(token);
			}
		});
	});
};

const loginStudent = async context => {
	const { username, password } = context.request.body;
	const student = await Student.findOne({
		username: username
	})
		.lean()
		.exec();
	if (student) {
		data = {
			_id: student._id,
			username: student.username,
			role: "student"
		};
		let response = await bcrypt.compare(password, student.password);
		if (response) {
			let token = await generateToken(data);
			return token;
		} else {
			context.status = err.status || 500;
			context.app.emit("error", "Invalid Credentials", context);
		}
	} else {
		context.status = err.status || 500;
		context.app.emit("error", "Invalid Credentials", context);
	}
};

const loginFaculty = async context => {
	const { username, password } = context.request.body;
	const faculty = await Faculty.findOne({
		username: username
	})
		.lean()
		.exec();
	if (faculty) {
		data = {
			_id: faculty._id,
			username: faculty.username,
			role: "faculty"
		};
		let response = await bcrypt.compare(password, faculty.password);
		if (response) {
			let token = await generateToken(data);
			return token;
		} else {
			context.status = err.status || 500;
			context.app.emit("error", "Invalid Credentials", context);
		}
	} else {
		context.status = err.status || 500;
		context.app.emit("error", "Invalid Credentials", context);
	}
};

const createStudent = async context => {
	try {
		let { username, password, fname, lname, dob, usn } = context.request.body;

		let hash = await bcrypt.hash(password, 12);

		let response = await new Student({
			username: username,
			password: hash,
			fname: fname,
			lname: lname,
			dob: new Date(dob).toDateString(),
			usn: usn,
			created_by: username
		}).save();

		let data = {
			_id: response._id,
			username: response.username,
			role: "student"
		};
		let token = await generateToken(data);
		return token;
	} catch (err) {
		return err;
	}
};

const createFaculty = context => {};

const getKey = async (context, next) => {
	let { designation, username } = context.request.body;
	let token = null;
	if (designation == "student") {
		if (Object.keys(context.request.body).length <= 3) {
			token = await loginStudent(context);
		} else {
			token = await createStudent(context);
		}
	} else if (designation == "faculty") {
		if (Object.keys(context.request.body).length <= 3) {
			token = await loginFaculty(context);
		} else {
			token = await createFaculty(context);
		}
	} else {
		context.status = err.status || 500;
		context.app.emit("error", "Invalid designation field", context);
	}
	context.status = 200;
	context.app.emit("response", { AccessToken: token, designation: designation, username: username }, context);
};

const verifyKey = async (context, next) => {
	try {
		let { authorization } = context.request.headers;
		if (authorization) {
			let token = authorization.split(" ")[1];
			var decoded = jwt.verify(token, process.env.PRIVATE_KEY);
			context.decoded = decoded;
			return next();
		} else {
			context.status = 500;
			context.app.emit("error", { message: "Authorization token missing" }, context);
		}
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

module.exports = {
	getKey,
	verifyKey
};
