const { User, Course } = require("../../models/index");

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

const isOwnedBy = async username => {
	try {
		let paramValue = (() => {
			if (context.params) {
				return param.username || param.course_id;
			} else {
				return body.username || body.course_id;
			}
		})();

		let user = await User.findOne({ username: paramValue })
			.lean()
			.exec();

		let course = await Course.findOne({ course_id: paramValue })
			.lean()
			.exec();

		if (user.owner && user.owner == username) {
			return true;
		} else if (course.owner && course.owner == username) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return err;
	}
};

const verifyUser = async (context, next) => {
	try {
		await addActivity(username, context);
		let username = context.decoded.username;
		switch (context.method) {
			case "GET":
				return next();
			case "PUT":
				if (await isOwnedBy(paramValue, username)) {
					return next();
				} else {
					let err = new Error(`Unauthorized method ${context.method} for ${username}`);
					err.name = "Unauthorized";
					throw err;
				}
			case "PATCH":
				if (await isOwnedBy(paramValue, username)) {
					return next();
				} else {
					let err = new Error(`Unauthorized method ${context.method} for ${username}`);
					err.name = "Unauthorized";
					throw err;
				}
			case "DELETE":
				if (await isOwnedBy(paramValue, username)) {
					return next();
				} else {
					let err = new Error(`Unauthorized method ${context.method} for ${username}`);
					err.name = "Unauthorized";
					throw err;
				}
			case "POST":
				let err = new Error(`Unauthorized method ${context.method} for ${username}`);
				err.name = "Unauthorized";
				throw err;
			default:
				context.status = 401;
				context.app.emit("error", new Error(`Unauthorized method ${context.method} for ${username}`), context);
		}
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

module.exports = {
	verifyUser
};
