const router = require("koa-router")();
const users = require("../controllers/users");

router.get("/api/user/", users.getUsers);
router.get("/api/user/:username", users.getUser);
router.post("/api/user", users.addUser);
router.delete("/api/user/:username", users.deleteUser);
router.patch("/api/user", users.updateUser);

router.get("*", (context, next) => {
	context.body = {
		statuscode: 404,
		message: "route is invalid"
	};
});

module.exports = router;
