const router = require("koa-router")();

const students = require("../controllers/student");
const faculty = require("../controllers/faculty");
const course = require("../controllers/course");

const domain = "/api/v1";

// Routes for Student
router.get(domain + "/students/", students.getStudents);
router.get(domain + "/students/:username", students.getStudent);
router.post(domain + "/students", students.addStudent);
router.delete(domain + "/students/:username", students.deleteStudent);
router.patch(domain + "/students/:username", students.updateStudent);

// Routes for Faculty
router.get(domain + "/faculty/", faculty.getFaculties);
router.get(domain + "/faculty/:username", faculty.getFaculty);
router.post(domain + "/faculty", faculty.addFaculty);
router.delete(domain + "/faculty/:username", faculty.deleteFaculty);
router.patch(domain + "/faculty/:username", faculty.updateFaculty);

// Routes for Courses
router.get(domain + "/courses/", course.getCourses);
router.get(domain + "/courses/:course_id", course.getCourse);
router.post(domain + "/courses", course.addCourse);
router.delete(domain + "/courses/:course_id", course.deleteCourse);
router.patch(domain + "/courses/:course_id", course.updateCourse);

// Route for Details of Courses
router.get(domain + "/courses/:course_id/:usn", course.getDetail);
router.post(domain + "/courses/:course_id", course.addDetail);
router.delete(domain + "/courses/:course_id/:usn", course.deleteDetail);
router.put(domain + "/courses/:course_id/:usn", course.updateDetail);

// Any other Route
router.get("*", (context, next) => {
	context.body = {
		statuscode: 404,
		message: "route is invalid"
	};
});

module.exports = router;
