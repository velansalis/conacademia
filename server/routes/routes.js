const user = require("../controllers/user");

const router = require("express").Router();

router.get("/api/user/:id", user.getUser);
router.post("/api/user", user.addUser);
router.delete("/api/user", user.deleteUser);
router.patch("/api/user", user.updateUser);

router.get("*", (req, res, next) => {
	let message = "Route not configured";
	res.json({ message });
});

module.exports = router;
