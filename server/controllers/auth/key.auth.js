const jwt = require("jsonwebtoken");
const { User } = require("../../models/index");

require("dotenv").config();

const { loginOrCreate, generateToken, addActivity } = require("./key.auth.methods");

const getKey = async context => {
	console.log(context);
	try {
		console.log(context);
		let tokenData = await loginOrCreate(context);
		let token = await generateToken(tokenData);

		let data = {
			AccessToken: token,
			designation: tokenData.designation,
			username: tokenData.username
		};

		context.status = 201;
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
