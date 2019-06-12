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

const isOwnedBy = async (paramValue, username) => {
	try {
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

const fetchCredentials = context => {
	let jwtValue = context.decoded.username;
	let body = context.request.body;
	let param = context.params;
	let paramValue = (() => {
		if (Object.keys(context.params) != 0) {
			return param.username || param.course_id;
		} else {
			return body.username || body.course_id;
		}
	})();
	return { jwtValue, paramValue };
};

const verifyUser = async (context, next) => {
	try {
		let { jwtValue, paramValue } = fetchCredentials(context);
		console.log(jwtValue, paramValue);
		await addActivity(jwtValue, context);
		switch (context.method) {
			case "GET":
				return next();
			case "PUT":
				if (await isOwnedBy(paramValue, jwtValue)) {
					return next();
				} else {
					let err = new Error(`Unauthorized method ${context.method} for ${jwtValue}`);
					err.name = "Unauthorized";
					throw err;
				}
			case "PATCH":
				if (await isOwnedBy(paramValue, jwtValue)) {
					return next();
				} else {
					let err = new Error(`Unauthorized method ${context.method} for ${jwtValue}`);
					err.name = "Unauthorized";
					throw err;
				}
			case "DELETE":
				if (await isOwnedBy(paramValue, jwtValue)) {
					return next();
				} else {
					let err = new Error(`Unauthorized method ${context.method} for ${jwtValue}`);
					err.name = "Unauthorized";
					throw err;
				}
			case "POST":
				let err = new Error(`Unauthorized method ${context.method} for ${jwtValue}`);
				err.name = "Unauthorized";
				throw err;
			default:
				context.status = 401;
				context.app.emit("error", new Error(`Unauthorized method ${context.method} for ${jwtValue}`), context);
		}
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

module.exports = {
	verifyUser
};
