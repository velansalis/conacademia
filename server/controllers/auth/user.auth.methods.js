const { User, Course } = require("../../models/index");

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

		console.log(paramValue, user, course);

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

module.exports = isOwnedBy;
