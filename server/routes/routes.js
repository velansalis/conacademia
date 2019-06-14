const router = require("koa-router")();

const { getKey, authKey } = require("../controllers/auth/key.auth");
const { filterUser } = require("../controllers/auth/user.auth");
const { filterFaculty } = require("../controllers/auth/course.auth");
const { getUploads } = require("../controllers/utils/file-util");

const { getUser, getUsers, addUser, deleteUser, updateUser } = require("../controllers/user");
const { getCourse, getCourses, addCourse, deleteCourse, updateCourse } = require("../controllers/course");
const { getDetail, addDetail, updateDetail, deleteDetail } = require("../controllers/course");

router.post(`/api/v1/auth/login`, getKey);

router.get(`/api/v1/users/`, authKey, filterUser, getUsers);
router.get(`/api/v1/users/:username`, authKey, filterUser, getUser);
router.post(`/api/v1/users`, authKey, filterUser, addUser);
router.delete(`/api/v1/users/:username`, authKey, filterUser, deleteUser);
router.patch(`/api/v1/users/:username`, authKey, filterUser, updateUser);

router.get(`/api/v1/courses/`, authKey, filterFaculty, getCourses);
router.get(`/api/v1/courses/:course_id`, authKey, filterFaculty, getCourse);
router.post(`/api/v1/courses`, authKey, filterFaculty, addCourse);
router.delete(`/api/v1/courses/:course_id`, authKey, filterFaculty, deleteCourse);
router.patch(`/api/v1/courses/:course_id`, authKey, filterFaculty, updateCourse);

router.get("/api/v1/uploads/:filename", authKey, filterUser, getUploads);

/*

// YET TO BE IMPLEMENTED

// Route for Details of Courses
router.get(`/api/v1/courses/:course_id/:usn`, authKey, verifyFaculty, getDetail);
router.post(`/api/v1/courses/:course_id`, authKey, verifyFaculty, addDetail);
router.delete(`/api/v1/courses/:course_id/:usn`, authKey, verifyFaculty, deleteDetail);
router.put(`/api/v1/courses/:course_id/:usn`, authKey, verifyFaculty, updateDetail);

*/

router.all("*", (context, next) => {
	const err = new Error("Unauthorized route");
	err.name = "Unauthorized";
	context.app.emit("error", err, context);
});

module.exports = router;
