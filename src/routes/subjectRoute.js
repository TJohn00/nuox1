const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/jwtMiddleware");
const {
addSubject,addSubjectToTeacher,deleteSubject,deleteSubjectFromTeacher,viewSubjects
} = require("../controllers/subjectController");


router.post("/add", requireAuth, addSubject);
router.post("/assignToTeacher", requireAuth, addSubjectToTeacher);
router.put("/delete/:subjectId", requireAuth, deleteSubject);
router.get("/removeFromTeacher", requireAuth, deleteSubjectFromTeacher);
router.get("/view", requireAuth, viewSubjects);

module.exports = router;
