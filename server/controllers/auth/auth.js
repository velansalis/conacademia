const { Student, Faculty } = require("../../models/index");

const addActivity = async (designation, username, context) => {
	let activityObject = {
		method: context.method,
		url: context.href,
		timestamp: new Date().toString()
	};
	if (designation == "student") {
		await Student.updateOne({ username: username }, { $push: { activities: activityObject } })
			.lean()
			.exec();
	} else {
		await Faculty.updateOne({ username: username }, { $push: { activities: activityObject } })
			.lean()
			.exec();
	}
};

const isCreatedBy = async (_username, username) => {
	console.log("CREATED :", username, _username);
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
	let { _id, username } = context.decoded;
	let _username = (() => {
		if (Object.keys(context.params) != 0) {
			return context.params.username;
		} else {
			return context.request.body.username;
		}
	})();
	console.log({ _id, username, _username });
	return { username, _username };
};

const verifyStudent = async (context, next) => {
	try {
		let { username, _username } = fetchCredentials(context);
		let method = context.method;
		if (method == "GET") {
			addActivity("student", username, context);
			return next();
		} else if (method == "POST" && false) {
			Object.assign(context.request.body, { created_by: username });
			console.log("POST", context.request.body);
			addActivity("student", username, context);
			return next();
		} else if (method == "DELETE" && (await isCreatedBy(_username, username))) {
			console.log("touched");
			addActivity("student", username, context);
			return next();
		} else if (method == "PATCH" && (await isCreatedBy(_username, username))) {
			addActivity("student", username, context);
			return next();
		} else if (method == "PUT" && (await isCreatedBy(_username, username))) {
			addActivity("student", username, context);
			return next();
		} else {
			context.status = 401;
			context.app.emit("error", "Unauthorized method", context);
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
