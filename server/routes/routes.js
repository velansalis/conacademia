const router = require("koa-router")();

const {
	getStudent,
	getStudents,
	addStudent,
	deleteStudent,
	updateStudent
} = require("../controllers/student");

const {
	getFaculties,
	getFaculty,
	addFaculty,
	updateFaculty,
	deleteFaculty
} = require("../controllers/faculty");

const {
	getCourse,
	getCourses,
	getDetail,
	addCourse,
	addDetail,
	updateCourse,
	updateDetail,
	deleteCourse,
	deleteDetail
} = require("../controllers/course");

const { getKey, verifyKey } = require("../controllers/jwt.auth");

const domain = "/api/v1";

// Route for getting the key
router.post(`${domain}/auth/key`, getKey);

// Routes for Student
router.get(`${domain}/students/`, verifyKey, getStudents);
router.get(`${domain}/students/:username`, verifyKey, getStudent);
router.post(`${domain}/students`, verifyKey, addStudent);
router.delete(`${domain}/students/:username`, verifyKey, deleteStudent);
router.patch(`${domain}/students/:username`, verifyKey, updateStudent);

// Routes for Faculty
router.get(`${domain}/faculty/`, verifyKey, getFaculties);
router.get(`${domain}/faculty/:username`, verifyKey, getFaculty);
router.post(`${domain}/faculty`, verifyKey, addFaculty);
router.delete(`${domain}/faculty/:username`, verifyKey, deleteFaculty);
router.patch(`${domain}/faculty/:username`, verifyKey, updateFaculty);

// Routes for Courses
router.get(`${domain}/courses/`, verifyKey, getCourses);
router.get(`${domain}/courses/:course_id`, verifyKey, getCourse);
router.post(`${domain}/courses`, verifyKey, addCourse);
router.delete(`${domain}/courses/:course_id`, verifyKey, deleteCourse);
router.patch(`${domain}/courses/:course_id`, verifyKey, updateCourse);

// Route for Details of Courses
router.get(`${domain}/courses/:course_id/:usn`, verifyKey, getDetail);
router.post(`${domain}/courses/:course_id`, verifyKey, addDetail);
router.delete(`${domain}/courses/:course_id/:usn`, verifyKey, deleteDetail);
router.put(`${domain}/courses/:course_id/:usn`, verifyKey, updateDetail);

// Catch all other routes
router.all("*", (context, next) => {
	const err = new Error("Invalid route");
	context.app.emit("error", err.message, context);
});

module.exports = router;
