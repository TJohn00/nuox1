const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/jwtMiddleware");
const { csvReader, pfpUpload } = require("../middleware/multerConfig");
const {
  importCsv,
  createTeacher,
  deleteTeacher,
  editTeacher,
  viewTeacher,
  viewTeacherAll,
  uploadProfilePicture,
} = require("../controllers/teacherController");

router.post("/upload",requireAuth,pfpUpload.single("profilePicture"),uploadProfilePicture);
router.post("/import", requireAuth, csvReader.single("csvFile"), importCsv);
router.post("/add", requireAuth, createTeacher);
router.delete("/delete/:teacherId", requireAuth, deleteTeacher);
router.put("/edit/:teacherId", requireAuth, editTeacher);
router.get("/view/:teacherId", requireAuth, viewTeacher);
router.post("/viewAll", requireAuth, viewTeacherAll);

module.exports = router;
