const chalk = require("chalk");

const logger = async (context, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	console.log(
		chalk.green.bold(context.method),
		chalk.underline(context.request.href),
		chalk.bold(ms),
		"ms"
	);
};

module.exports = {
	logger
};
