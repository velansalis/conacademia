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
		data: data,
		method: context.method,
		url: context.href
	};
});

app.on("error", (err, context) => {
	console.log(err);
	let prettyError = new Array();
	let { name, message } = err;
	let errObj = {
		name,
		message
	};
	prettyError.push(errObj);

	context.body = {
		errors: prettyError,
		data: [],
		url: context.href,
		method: context.method
	};
});

module.exports = app;
