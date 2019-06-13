const { User, Course } = require("../../models/index");

const getParamValue = context => {
	if (context.params) {
		return context.params.username || context.params.course_id;
	} else {
		return body.username || body.course_id;
	}
};

const isOwnedBy = async (username, context) => {
	try {
		console.log(context.params);
		let paramValue = getParamValue(context);
		let user = await User.findOne({ username: paramValue })
			.lean()
			.exec();

		let course = await Course.findOne({ course_id: paramValue })
			.lean()
			.exec();

		console.log("isownedby", paramValue, user, course);

		if (user && user.owner == username) {
			return true;
		} else if (course && course.owner == username) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return err;
	}
};

module.exports = {
	isOwnedBy
};
