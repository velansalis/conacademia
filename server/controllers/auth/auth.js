const { Student, Faculty } = require("../../models/index");

const addActivity = async (_id, username, context) => {
	let activityObject = {
		method: context.method,
		url: context.href
	};
	let response = await Student.updateOne({ _id: _id, username: username }, { $push: { activities: activityObject } })
		.lean()
		.exec();
	console.log(response);
};

const verifyStudent = async (context, next) => {
	try {
		let { _id, username } = context.decoded;
		let _username = (() => {
			if (Object.keys(context.params) != 0) {
				return context.params.username;
			} else {
				return context.request.body.username;
			}
		})();

		if (context.method == "GET") {
			addActivity(_id, _username, context);
			return next();
		} else {
			console.log("FROM USER :", _username);
			if (_username == username) {
				addActivity(_id, _username, context);
				return next();
			} else {
				context.status = 500;
				context.app.emit("error", { message: "Unallowed method" }, context);
			}
		}
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

const verifyFaculty = (context, next) => {
	console.log("Faculty Verified", context.decoded);
	return next();
};

module.exports = {
	verifyStudent,
	verifyFaculty
};
