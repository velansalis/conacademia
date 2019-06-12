const router = require("koa-router")();

const { getUser, getUsers, addUser, deleteUser, updateUser } = require("../controllers/user");
const { getCourse, getCourses, getDetail, addCourse, updateCourse } = require("../controllers/course");
const { addDetail, updateDetail, deleteCourse, deleteDetail } = require("../controllers/course");

const { getKey, verifyKey } = require("../controllers/auth/key-auth");
const { verifyUser } = require("../controllers/auth/user-auth");

const domain = "/api/v1";

// Route for getting the key
router.post(`${domain}/auth/key`, getKey);

// Routes for User
router.get(`${domain}/users/`, verifyKey, verifyUser, getUsers);
router.get(`${domain}/users/:username`, verifyKey, verifyUser, getUser);
router.post(`${domain}/users`, verifyKey, verifyUser, addUser);
router.delete(`${domain}/users/:username`, verifyKey, verifyUser, deleteUser);
router.patch(`${domain}/users/:username`, verifyKey, verifyUser, updateUser);

// Routes for Courses
router.get(`${domain}/courses/`, verifyKey, verifyFaculty, getCourses);
router.get(`${domain}/courses/:course_id`, verifyKey, verifyFaculty, getCourse);
router.post(`${domain}/courses`, verifyKey, verifyFaculty, addCourse);
router.delete(`${domain}/courses/:course_id`, verifyKey, verifyFaculty, deleteCourse);
router.patch(`${domain}/courses/:course_id`, verifyKey, verifyFaculty, updateCourse);

/*

// YET TO BE IMPLEMENTED

// Route for Details of Courses
router.get(`${domain}/courses/:course_id/:usn`, verifyKey, verifyFaculty, getDetail);
router.post(`${domain}/courses/:course_id`, verifyKey, verifyFaculty, addDetail);
router.delete(`${domain}/courses/:course_id/:usn`, verifyKey, verifyFaculty, deleteDetail);
router.put(`${domain}/courses/:course_id/:usn`, verifyKey, verifyFaculty, updateDetail);

*/

// Catch all other routes
router.all("*", (context, next) => {
	const err = new Error("Unauthorized route");
	err.name = "Unauthorized";
	context.app.emit("error", err, context);
});

module.exports = router;
