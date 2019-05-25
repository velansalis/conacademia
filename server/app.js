const koa = require("koa");
const mongoose = require("mongoose");
const koaBody = require("koa-body");
const app = new koa();

require("dotenv").config();
require("./dbconnect").call();

const router = require("./routes/routes");

app.use(koaBody());

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
