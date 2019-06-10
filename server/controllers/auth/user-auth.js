const { User } = require("../../models/index");

const addActivity = async (username, context) => {
	let activityObject = {
		method: context.method,
		url: context.href,
		timestamp: new Date().toString()
	};
	await User.updateOne({ username: username }, { $push: { activities: activityObject } })
		.lean()
		.exec();
};

const isCreatedBy = async (_username, username) => {
	try {
		let response = await Student.findOne({ username: _username })
			.lean()
			.exec();
		console.log(response);
		if (response.created_by == username) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return err;
	}
};

const fetchCredentials = context => {
	let jwt_username = context.decoded.username;
	let param_username = (() => {
		if (Object.keys(context.params) != 0) {
			return context.params.username;
		} else {
			return context.request.body.username;
		}
	})();
	console.log({ jwt_username, param_username });
	return { jwt_username, param_username };
};

const verifyUser = async (context, next) => {
	try {
		let { jwt_username, param_username } = fetchCredentials(context);
		await addActivity(jwt_username, context);
		switch (context.method) {
			case "GET":
				return next();
			case "POST":
				throw new Error("Unauthorized method");
			case "PUT":
				if (await isCreatedBy(param_username, jwt_username)) return next();
				else throw new Error("Unauthorized method");
			case "PATCH":
				if (await isCreatedBy(param_username, jwt_username)) return next();
				else throw new Error("Unauthorized method");
			case "DELETE":
				if (await isCreatedBy(param_username, jwt_username)) return next();
				else throw new Error("Unauthorized method");
			default:
				context.status = 401;
				context.app.emit("error", "Unauthorized method", context);
		}
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

module.exports = {
	verifyUser
};
