// Packages
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const app = express();

app.use((req, res, next) => {
	console.log(req);
	next();
});

// Importing Environment Variables
require("dotenv").config();

// Imports
const routes = require("./routes/routes");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true
	})
	.then(res => {
		console.log(
			`[DATABASE] Mongodb Successfully Connected - [${
				process.env.MONGO_URL
			}]`
		);
	})
	.catch(err => {
		console.log("[DATABASE] There was an error connecting database.");
	});

app.use(morgan("tiny"));

// Redirecting Requests
app.use("/", routes);

module.exports = app;
