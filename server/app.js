const koa = require("koa");
const koaBody = require("koa-body");
const koaLogger = require("koa-logger");

const router = require("./routes/routes");
const app = new koa();

app.use(koaBody({ multipart: true }));
app.use(koaLogger());

app.use(router.routes());
app.use(router.allowedMethods());
app.use((context, next) => {
	context.response.status = 404;
	const error = new Error("Route not allowed");
	next(error);
});
app.use((error, context, next) => {
	context.body = {
		error: error
	};
});

module.exports = app;
