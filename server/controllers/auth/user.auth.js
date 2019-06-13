const { isOwnedBy } = require("./user.auth.methods");

const filterUser = async (context, next) => {
	let user = context.decoded.username;
	let errmsg = `Resource blocked ${context.method} for user ${user}. You dont own this resource`;
	try {
		switch (context.method) {
			case "GET":
				break;
			case "PUT":
				if (!(await isOwnedBy(user, context))) throw new Error(errmsg);
				break;
			case "PATCH":
				if (!(await isOwnedBy(user, context))) throw new Error(errmsg);
				break;
			case "DELETE":
				if (!(await isOwnedBy(user, context))) throw new Error(errmsg);
				break;
			case "POST":
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

const filterFaculty = async (context, next) => {
	let errmsg = `Resource blocked ${context.method} for user ${user}. You dont own this resource`;
	try {
		let { designation } = context.decoded;
		console.log(designation);
		switch (context.method) {
			case "GET":
				break;
			case "PUT":
				if (designation == "faculty" && !(await isOwnedBy(user, context))) throw new Error(errmsg);
				break;
			case "PATCH":
				if (designation == "faculty" && !(await isOwnedBy(user, context))) throw new Error(errmsg);
				break;
			case "DELETE":
				if (designation == "faculty" && !(await isOwnedBy(user, context))) throw new Error(errmsg);
				break;
			case "POST":
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
	filterUser,
	filterFaculty
};
