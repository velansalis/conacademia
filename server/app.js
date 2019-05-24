// Packages
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();

// Importing Environment Variables
require("dotenv").config();

// Imports
const routes = require("./routes/routes");

// Middlewares
mongoose
	.connect(process.env.MONGO_URL, { useNewUrlParser: true })
	.then(res => {
		console.log(
			`Database Successfully Connected - [${process.env.MONGO_URL}]`
		);
	})
	.catch(err => {
		console.log("There was an error connecting database.");
	});

app.use(morgan("tiny"));

// Redirecting Requests
app.use("/", routes);

module.exports = app;
