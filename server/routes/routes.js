const router = require("koa-router")();

const {
	getStudent,
	getStudents,
	addStudent,
	deleteStudent,
	updateStudent
} = require("../controllers/student");
const faculty = require("../controllers/faculty");
const course = require("../controllers/course");

const domain = "/api/v1";

// Routes for Student
router.get(domain + "/students/", getStudents);
router.get(domain + "/students/:username", getStudent);
router.post(domain + "/students", addStudent);
router.delete(domain + "/students/:username", deleteStudent);
router.patch(domain + "/students/:username", updateStudent);

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

module.exports = router;
