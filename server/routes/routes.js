const router = require("koa-router")();

const students = require("../controllers/student");
const faculty = require("../controllers/faculty");
const course = require("../controllers/course");

// Routes for Student
router.get("/api/student/", students.getStudents);
router.get("/api/student/:username", students.getStudent);
router.post("/api/student", students.addStudent);
router.delete("/api/student/:username", students.deleteStudent);
router.patch("/api/student/:username", students.updateStudent);

// Routes for Faculty
router.get("/api/faculty/", faculty.getFaculties);
router.get("/api/faculty/:username", faculty.getFaculty);
router.post("/api/faculty", faculty.addFaculty);
router.delete("/api/faculty/:username", faculty.deleteFaculty);
router.patch("/api/faculty/:username", faculty.updateFaculty);

// Routes for Courses
router.get("/api/course/", course.getCourses);
router.get("/api/course/:course_id", course.getCourse);
router.post("/api/course", course.addCourse);
router.delete("/api/course/:course_id", course.deleteCourse);
router.patch("/api/course/:course_id", course.updateCourse);

// Route for Details of Courses
router.get("/api/course/:course_id/:usn", course.getDetail);
router.post("/api/course/:course_id", course.addDetail);
router.delete("/api/course/:course_id/:usn", course.deleteDetail);
router.put("/api/course/:course_id/:usn", course.updateDetail);

// Any other Route
router.get("*", (context, next) => {
	context.body = {
		statuscode: 404,
		message: "route is invalid"
	};
});

module.exports = router;
