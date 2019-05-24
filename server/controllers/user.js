module.exports = {
	getUser: (req, res, next) => {
		let message = "There you go. User";
		res.json({
			message
		});
	},
	addUser: (req, res, next) => {
		let message = "User Created";
		res.json({
			message
		});
	},
	deleteUser: (req, res, next) => {
		let message = "User Deleted";
		res.json({
			message
		});
	},
	updateUser: (req, res, next) => {
		let message = "User Deleted";
		res.json({
			message
		});
	}
};
