const koa = require("koa");
const mongoose = require("mongoose");
const koaBody = require("koa-body");
const router = require("./routes/routes");
const app = new koa();

require("dotenv").config();
require("./mongo-connect").call();

app.use(require("./middlewares/logger").logger);
app.use(koaBody());

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
