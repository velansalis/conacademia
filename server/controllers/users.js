const User = require("../models/index").user;

module.exports = {
	getUser: (req, res, next) => {
		let username = req.params.username;
		let message = `There you go. ${username}`;
		res.json({
			message: message
		});
	},
	addUser: (req, res, next) => {
		console.log(req.body);
		User.create(
			{
				username: req.body.username,
				password: req.body.password,
				fname: req.body.fname,
				lname: req.body.lname,
				dob: new Date(req.body.dob),
				designation: req.body.designation
			},
			(err, res) => {
				// console.log(err);
			}
		);
		res.json({
			message: "Created",
			body: req.body
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
