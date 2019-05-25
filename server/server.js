const http = require("http");
const app = require("./app");
require("dotenv").config();

http.createServer(app).listen(process.env.PORT, () => {
	console.clear();
	console.log(`[NAME] ${require("./package.json").name}`);
	console.log(`[VERSION] ${require("./package.json").version}`);
	console.log(`[NODE] Listening in ${process.env.PORT}`);
});
