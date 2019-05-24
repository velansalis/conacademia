const app = require("./app");

const PORT = 3000;

app.listen(PORT, () => {
	console.clear();
	console.log(`[NAME] ${require("./package.json").name}`);
	console.log(`[VERSION] ${require("./package.json").version}`);
	console.log(`[NODE] Listening in ${PORT}`);
});
