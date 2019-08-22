const koa = require("koa");
const koaBody = require("koa-body");
const koaLogger = require("koa-logger");

const router = require("./routes/routes");
const app = new koa();

app.use(koaBody({ multipart: true }));
app.use(koaLogger());
app.use(router.routes());
app.use(router.allowedMethods());

app.on("response", (data, context) => {
	context.body = {
		accessMethod: context.method,
		accessUrl: context.href,
		statusCode: context.response.status,
		data: data
	};
});

app.on("error", (err, context) => {
	console.log(err);

	let name = null,
		message = null;

	if (err.name == "MongoError") {
		name = err.name;
		message = err.errmsg;
	} else {
		name = err.name;
		message = err.message;
	}
	let prettyError = new Array();
	prettyError.push({
		name,
		message
	});

	context.body = {
		errors: prettyError,
		data: [],
		url: context.href,
		method: context.method
	};
});

module.exports = app;
