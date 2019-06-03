const koa = require("koa");
const mongoose = require("mongoose");
const koaBody = require("koa-body");
const router = require("./routes/routes");
const app = new koa();

app.use(require("./middlewares/logger").logger);
app.use(koaBody({ multipart: true }));

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
