const { isOwnedBy } = require("./user.auth.methods");

const filterUser = async (context, next) => {
	let user = context.decoded.username;
	let errmsg = `Resource blocked with ${context.method} for ${user}`;
	try {
		switch (context.method) {
			case "GET":
				break;
			case "PUT":
				if (await !isOwnedBy(user)) throw new Error(errmsg);
				break;
			case "PATCH":
				if (await !isOwnedBy(user)) throw new Error(errmsg);
				break;
			case "DELETE":
				if (await !isOwnedBy(user)) throw new Error(errmsg);
				break;
			case "POST":
				throw new Error(errmsg);
			default:
				throw new Error(errmsg);
		}
	} catch (err) {
		context.status = err.status || 500;
		err.name = "AccessError";
		context.app.emit("error", err, context);
	} finally {
		return next();
	}
};

module.exports = {
	filterUser
};
