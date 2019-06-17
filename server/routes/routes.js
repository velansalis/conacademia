const router = require("koa-router")();

const { getKey, authKey } = require("../controllers/auth/key.auth");
const { filterUser } = require("../controllers/auth/user.auth");
const { filterFaculty } = require("../controllers/auth/course.auth");
const { getUploads } = require("../controllers/utils/file-util");

const { getUser, getUsers, addUser, deleteUser, updateUser } = require("../controllers/user");
const { getCourse, getCourses, addCourse, deleteCourse, updateCourse } = require("../controllers/course");
const { getDetail, addDetail, updateDetail, deleteDetail } = require("../controllers/course");

router.post(`/v1/auth/login`, getKey); // Login Route
router.post(`/v1/auth/register`, addUser); // Register Route

router.get(`/v1/users/`, authKey, filterUser, getUsers);
router.get(`/v1/users/:username`, authKey, filterUser, getUser);
router.delete(`/v1/users/:username`, authKey, filterUser, deleteUser);
router.patch(`/v1/users/:username`, authKey, filterUser, updateUser);

router.get(`/v1/courses/`, authKey, filterFaculty, getCourses);
router.get(`/v1/courses/:course_id`, authKey, filterFaculty, getCourse);
router.post(`/v1/courses`, authKey, filterFaculty, addCourse);
router.delete(`/v1/courses/:course_id`, authKey, filterFaculty, deleteCourse);
router.patch(`/v1/courses/:course_id`, authKey, filterFaculty, updateCourse);

router.get(`/v1/courses/:course_id/:usn`, authKey, filterFaculty, getDetail);
router.post(`/v1/courses/:course_id`, authKey, filterFaculty, addDetail);
router.delete(`/v1/courses/:course_id/:usn`, authKey, filterFaculty, deleteDetail);
router.put(`/v1/courses/:course_id/:usn`, authKey, filterFaculty, updateDetail);

router.get("/v1/uploads/:filename", authKey, filterUser, getUploads);

router.all("*", (context, next) => {
	const err = new Error("Unauthorized route");
	err.name = "Unauthorized";
	context.app.emit("error", err, context);
});

module.exports = router;
