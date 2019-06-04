const koa = require("koa");
const koaBody = require("koa-body");
const koaLogger = require("koa-logger");

const router = require("./routes/routes");
const app = new koa();

app.use(koaBody({ multipart: true }));
app.use(koaLogger());

app.use(router.routes());
app.use(router.allowedMethods());

app.on("error", (err, context) => {
	context.body = {
		errors: err,
		data: []
	};
});

module.exports = app;
