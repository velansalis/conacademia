const router = require("koa-router")();

const { getStudent, getStudents, addStudent, deleteStudent, updateStudent } = require("../controllers/student");

const { getFaculties, getFaculty, addFaculty, updateFaculty, deleteFaculty } = require("../controllers/faculty");

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

const { getKey, verifyKey } = require("../controllers/auth/jwt.auth");
const { verifyStudent, verifyFaculty } = require("../controllers/auth/auth");

const domain = "/api/v1";

// Route for getting the key
router.post(`${domain}/auth/key`, getKey);

// Routes for Student
router.get(`${domain}/students/`, verifyKey, verifyStudent, getStudents);
router.get(`${domain}/students/:username`, verifyKey, verifyStudent, getStudent);
router.post(`${domain}/students`, verifyKey, verifyStudent, addStudent);
router.delete(`${domain}/students/:username`, verifyKey, verifyStudent, deleteStudent);
router.patch(`${domain}/students/:username`, verifyKey, verifyStudent, updateStudent);

// Routes for Faculty
router.get(`${domain}/faculty/`, verifyKey, verifyFaculty, getFaculties);
router.get(`${domain}/faculty/:username`, verifyKey, verifyFaculty, getFaculty);
router.post(`${domain}/faculty`, verifyKey, verifyFaculty, addFaculty);
router.delete(`${domain}/faculty/:username`, verifyKey, verifyFaculty, deleteFaculty);
router.patch(`${domain}/faculty/:username`, verifyKey, verifyFaculty, updateFaculty);

// Routes for Courses
router.get(`${domain}/courses/`, verifyKey, verifyFaculty, getCourses);
router.get(`${domain}/courses/:course_id`, verifyKey, verifyFaculty, getCourse);
router.post(`${domain}/courses`, verifyKey, verifyFaculty, addCourse);
router.delete(`${domain}/courses/:course_id`, verifyKey, verifyFaculty, deleteCourse);
router.patch(`${domain}/courses/:course_id`, verifyKey, verifyFaculty, updateCourse);

// Route for Details of Courses
router.get(`${domain}/courses/:course_id/:usn`, verifyKey, verifyFaculty, getDetail);
router.post(`${domain}/courses/:course_id`, verifyKey, verifyFaculty, addDetail);
router.delete(`${domain}/courses/:course_id/:usn`, verifyKey, verifyFaculty, deleteDetail);
router.put(`${domain}/courses/:course_id/:usn`, verifyKey, verifyFaculty, updateDetail);

// Catch all other routes
router.all("*", (context, next) => {
	const err = new Error("Invalid route");
	context.app.emit("error", err.message, context);
});

module.exports = router;
