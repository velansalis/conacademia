const router = require("koa-router")();

const users = require("../controllers/users");
const dataset = require("../controllers/datasets");

// Routes for Users
router.get("/api/user/", users.getUsers);
router.get("/api/user/:username", users.getUser);
router.post("/api/user", users.addUser);
router.delete("/api/user/:username", users.deleteUser);
router.patch("/api/user/:username", users.updateUser);

// Routes for Datasets
router.get("/api/dataset/", dataset.getDatasets);
router.get("/api/dataset/:id", dataset.getDataset);
router.post("/api/dataset", dataset.addDataset);
router.delete("/api/dataset/:id", dataset.deleteDataset);
router.patch("/api/dataset/:id", dataset.updateDataset);

// Any other Route
router.get("*", (context, next) => {
	context.body = {
		statuscode: 404,
		message: "route is invalid"
	};
});

module.exports = router;
