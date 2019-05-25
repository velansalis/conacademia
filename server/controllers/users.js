const User = require("../models/index").user;

module.exports = {
	getUsers: async (context, next) => {
		try {
			let response = await User.find().exec();
			context.body = {
				message: "Users Found",
				count: response.length,
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err,
				data: response
			};
		}
	},
	getUser: async (context, next) => {
		try {
			let response = await User.find({
				username: context.params.username
			}).exec();
			context.body = {
				message: "Users Found",
				count: response.length,
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err,
				data: response
			};
		}
	},
	addUser: async (context, next) => {
		try {
			let response = await new User({
				username: context.request.body.username,
				password: context.request.body.password,
				fname: context.request.body.fname,
				lname: context.request.body.lname,
				dob: new Date(context.request.body.dob),
				designation: context.request.body.designation
			}).save();
			context.body = {
				message: "User Added",
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err
			};
		}
	},
	deleteUser: async (context, next) => {
		try {
			let response = await User.deleteOne({
				username: context.params.username
			}).exec();
			context.body = {
				message: "User Deleted",
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err,
				data: response
			};
		}
	},
	updateUser: async (context, next) => {
		try {
			let response = await User.findOneAndUpdate(
				context.request.body.query,
				context.request.body.value
			).exec();
			context.body = {
				message: "User Updated",
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err
			};
		}
	}
};
