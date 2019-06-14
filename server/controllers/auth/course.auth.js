const { Course } = require("../../models/index");

const checkCourseOwnership = async (user, context) => {
	try {
		let paramValue = context.params ? context.params.course_id : context.request.body.course_id;
		let course = await Course.findOne({ course_id: paramValue })
			.lean()
			.exec();
		if (!course && context.method == "POST") {
			return true;
		} else if (course && course.owner == user) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return err;
	}
};

const filterFaculty = async (context, next) => {
	let user = context.decoded.username;
	let errmsg = `Resource blocked ${context.method} for user ${user}. You dont own this resource`;
	try {
		let { designation } = context.decoded;
		switch (context.method) {
			case "PUT":
			case "PATCH":
			case "DELETE":
			case "POST":
				if (designation == "faculty" || (await checkCourseOwnership(user, context))) break;
				throw new Error(errmsg);
			case "GET":
				break;
			default:
				throw new Error(errmsg);
		}
		return next();
	} catch (err) {
		context.status = 404;
		err.name = "AccessError";
		context.app.emit("error", err, context);
	}
};

module.exports = {
	filterFaculty
};
