const users = require("../controllers/users");

const router = require("express").Router();

router.get("/api/user/:username", users.getUser);
router.post("/api/user", users.addUser);
router.delete("/api/user", users.deleteUser);
router.patch("/api/user", users.updateUser);

router.get("*", (req, res, next) => {
	let message = "Route not configured";
	res.json({ message });
});

module.exports = router;
