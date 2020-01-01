const chalk = require("chalk");
const mongoose = require("mongoose");
const server = require("http");
require("dotenv").config();

const app = require("./app");

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    server.createServer(app.callback()).listen(process.env.PORT, () => {
      console.log(
        `${chalk.dim(`[log]`)} Name : ${chalk.bold.white(
          require("./package.json.js").name
        )}`
      );
      console.log(
        `${chalk.dim(`[log]`)} Version : ${chalk.bold.white(
          require("./package.json.js").version
        )}`
      );
      console.log(
        `${chalk.dim(`[log]`)} Mongodb : ${chalk.bold.green(
          `Running`
        )} at 27017`
      );
      console.log(
        `${chalk.dim(`[log]`)} Server  : ${chalk.bold.green(`Running`)} at ${
          process.env.PORT
        }`
      );
    });
  } catch (err) {
    console.log(chalk.red.bold("[Error] "), err);
    throw err;
  }
})();

process.on("SIGINT", async () => {
  console.log("\n");
  console.log(
    chalk.green.bold("Mongoose : "),
    chalk.red.bold("Connection Closed")
  );
  mongoose.connection.close();
  process.exit();
});
