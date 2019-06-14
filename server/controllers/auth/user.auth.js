const { User } = require("../../models/index");

const checkUserOwnership = async (username, context) => {
	try {
		let paramValue = context.params ? context.params.username : context.request.body.username;
		let user = await User.findOne({ username: paramValue })
			.lean()
			.exec();

		if (user && user.owner == username) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return err;
	}
};

const filterUser = async (context, next) => {
	let user = context.decoded.username;
	let errmsg = `Resource blocked ${context.method} for user ${user}. You dont own this resource`;
	try {
		switch (context.method) {
			case "GET":
				break;
			case "POST":
				throw new Error(errmsg);
			case "PUT":
			case "PATCH":
			case "DELETE":
				if (await checkUserOwnership(user, context)) break;
				throw new Error(errmsg);
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
	filterUser
};
