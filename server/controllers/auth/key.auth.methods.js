const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const { User } = require("../../models/index");

const addActivity = async (username, context) => {
	let activity = {
		activities: {
			method: context.method,
			url: context.href,
			timestamp: new Date().toDateString()
		}
	};
	await User.updateOne({ username: username }, { $push: activity })
		.lean()
		.exec();
};

const generateToken = data => {
	let tokenExpiry = 60 * 60 * 24;
	return new Promise((resolve, reject) => {
		jwt.sign(data, process.env.PRIVATE_KEY, { expiresIn: tokenExpiry }, (err, token) => {
			if (err) {
				reject(err);
			} else {
				resolve(token);
			}
		});
	});
};

const loginOrCreate = context => {
	return new Promise(async (resolve, reject) => {
		try {
			let { username, password } = context.request.body;
			let user = await User.findOne({ username: username })
				.lean()
				.exec();
			if (user) {
				let response = await bcrypt.compare(password, user.password);
				if (response) {
					resolve({
						_id: user._id,
						username: user.username,
						designation: user.designation
					});
				} else {
					let err = new Error(`Invalid Credentials : Wrong Password`);
					err.name = "Unauthorized";
					throw err;
				}
			} else {
				let { username, password, fname, lname, designation, dob, usn } = context.request.body;
				console.log(username, password, fname, lname, designation, dob, usn);
				let hash = await bcrypt.hash(password, 12);
				let user = await new User({
					username: username,
					password: hash,
					fname: fname,
					lname: lname,
					designation: designation,
					dob: new Date(dob).toDateString(),
					age: parseInt((new Date().getTime() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365)),
					usn: usn,
					owner: username
				}).save();
				resolve({
					_id: user._id,
					username: user.username,
					designation: user.designation
				});
			}
		} catch (err) {
			reject(err);
		}
	});
};

module.exports = {
	addActivity,
	generateToken,
	loginOrCreate
};
