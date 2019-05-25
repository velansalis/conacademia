const router = require("koa-router")();

const students = require("../controllers/student");
const faculty = require("../controllers/faculty");
const dataset = require("../controllers/datasets");

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

// Routes for Datasets
router.get("/api/dataset/", dataset.getDatasets);
router.get("/api/dataset/:id", dataset.getDataset);
router.post("/api/dataset", dataset.addDataset);
router.delete("/api/dataset/:id", dataset.deleteDataset);
router.patch("/api/dataset/:id", dataset.updateDataset);

// Any other Route
router.get("*", (context, next) => {
	context.body = {
		statuscode: 404,
		message: "route is invalid"
	};
});

module.exports = router;
