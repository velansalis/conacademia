const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const generateToken = data => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			data,
			process.env.PRIVATE_KEY,
			{ expiresIn: 60 * 60 },
			(err, token) => {
				if (err) {
					reject(err);
				} else {
					resolve(token);
				}
			}
		);
	});
};

const getKey = async (context, next) => {
	const { Student, Faculty } = require("../models/index");
	const { username, password } = context.request.body;

	try {
		let hashedPassword = null,
			data = null;
		const student = await Student.findOne({
			username: username
		})
			.lean()
			.exec();
		const faculty = await Faculty.findOne({
			username: username
		})
			.lean()
			.exec();

		// Set Student or Faculty
		if (student) {
			data = {
				_id: student._id,
				username: student.username,
				designation: "student"
			};
			hashedPassword = student.password;
		} else if (faculty) {
			data = {
				_id: faculty._id,
				username: faculty.username,
				designation: "faculty"
			};
			hashedPassword = faculty.password;
		} else {
			throw new Error("Invalid Credentials");
		}

		// Compare hashed password
		let response = await bcrypt.compare(password, hashedPassword);
		if (response) {
			let token = await generateToken(data);
			context.status = 200;
			context.app.emit("response", { AccessToken: token }, context);
		} else {
			throw new Error("Invalid Credentials");
		}
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", "Invalid Credentials", context);
	}
};

const verifyKey = async (context, next) => {
	let { authorization } = context.request.headers;
	let token = authorization.split(" ")[1];
	try {
		var decoded = jwt.verify(token, process.env.PRIVATE_KEY);
		context.jwtDecoded = decoded;
		return next();
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

module.exports = {
	getKey,
	verifyKey
};
