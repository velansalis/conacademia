const fs = require("fs");
const path = require("path");
const promisePipe = require("promisepipe");

const upload = uploadfile => {
	const savefile = Date.now().toString() + uploadfile.name;
	let readStream = fs.createReadStream(uploadfile.path);
	let writeStream = fs.createWriteStream(path.join("uploads", savefile));
	return new Promise(async (resolve, reject) => {
		try {
			await promisePipe(
				readStream.on("error", () => {
					reject(null);
				}),
				writeStream.on("error", () => {
					reject(null);
				})
			);
		} catch (err) {
			reject(err);
		} finally {
			resolve(savefile);
		}
	});
};

const getUploads = (context, next) => {
	let filepath = path.join("uploads", context.params.filename);
	let readableFileStream = null;
	try {
		readableFileStream = fs.createReadStream(filepath);
	} catch (err) {
		context.status = 404;
		context.app.emit("error", "File Not found", context);
	} finally {
		context.status = 200;
		context.app.emit("response", { readableFileStream }, context);
	}
};

const removeUploads = filename => {
	return new Promise((resolve, reject) => {
		fs.unlink(path.join("uploads", filename), err => {
			if (err) reject(err);
			else resolve();
		});
	});
};

module.exports = {
	upload,
	getUploads,
	removeUploads
};
