const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User } = require("../../models/index");

require("dotenv").config();

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

const getToken = data => {
	return new Promise(async (resolve, reject) => {
		let username = data.username;
		let response = await User.findOne({ username: username })
			.lean()
			.exec();
		if (response.token) {
			resolve(response.token);
		} else {
			let tokenExpiry = 60 * 60 * 24;
			jwt.sign(data, process.env.PRIVATE_KEY, { expiresIn: tokenExpiry }, async (err, token) => {
				if (err) {
					reject(err);
				} else {
					await User.findOneAndUpdate({ username: username }, { token: token }).exec();
					resolve(token);
				}
			});
		}
	});
};

const login = context => {
	return new Promise(async (resolve, reject) => {
		let user;
		try {
			let { username, password } = context.request.body;
			user = await User.findOne({ username: username })
				.lean()
				.exec();
			if (user) {
				let response = await bcrypt.compare(password, user.password);
				if (!response) {
					let err = new Error(`Invalid Credentials : Wrong Password`);
					err.name = "Unauthorized";
					throw err;
				}
			}
		} catch (err) {
			reject(err);
		} finally {
			resolve({
				_id: user._id,
				username: user.username,
				designation: user.designation
			});
		}
	});
};

const getKey = async context => {
	try {
		let tokenData = await login(context);
		let token = await getToken(tokenData);
		let data = {
			AccessToken: token,
			designation: tokenData.designation,
			username: tokenData.username
		};
		context.app.emit("response", data, context);
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

const authKey = async (context, next) => {
	try {
		let { authorization } = context.request.headers;
		if (authorization) {
			let token = authorization.split(" ")[1];
			var decoded = jwt.verify(token, process.env.PRIVATE_KEY);
			let user = await User.findOne({ username: decoded.username })
				.lean()
				.exec();
			if (user && decoded) {
				context.decoded = decoded;
				await addActivity(decoded.username, context);
				return next();
			} else {
				let err = new Error("Invalid access token");
				err.name = "AccessTokenError";
				throw err;
			}
		} else {
			context.status = 500;
			context.app.emit("error", { message: "Missing access token" }, context);
		}
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

module.exports = {
	getKey,
	authKey
};
