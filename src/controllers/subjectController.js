const Teacher = require("../models/teacher");
const Subject = require("../models/subject");

const addSubjectToTeacher = async (req, res) => {
  try {
    const teacherId = req.body.teacherId;
    const subjectId = req.body.subjectId;

    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const assignedSubjects = await teacher.getSubjects();
    if (assignedSubjects.length >= 5) {
      return res.status(400).json({ error: "Teacher already has the maximum number of subjects assigned" });
    }

    const isAssigned = await teacher.hasSubject(subject);
    if (isAssigned) {
      return res
        .status(400)
        .json({ error: "Subject is already assigned to the teacher" });
    }

    await teacher.addSubject(subject);

    res.status(200).json({ message: "Subject added to the teacher" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteSubjectFromTeacher = async (req, res) => {
  try {
    const teacherId = req.body.teacherId;
    const subjectId = req.body.subjectId;

    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const isAssigned = await teacher.hasSubject(subject);
    if (!isAssigned) {
      return res
        .status(400)
        .json({ error: "Subject is not assigned to the teacher" });
    }

    await teacher.removeSubject(subject);

    res.status(200).json({ message: "Subject removed from the teacher" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addSubject = async (req, res) => {
  try {
    const  name  = req.body.subject;

    console.log(name)
    if (!name) {
      return res.status(400).json({ error: 'Subject name is required' });
    }

    const existingSubject = await Subject.findOne({ where: { name } });
    if (existingSubject) {
      return res.status(400).json({ error: 'Subject already exists' });
    }

    const subject = await Subject.create({ name });

    res.status(201).json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.subjectId;

    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const teachers = await Teacher.findAll({
      include: [
        {
          model: Subject,
          where: { id: subjectId },
        },
      ],
    });

    if (teachers.length > 0) {
      return res.status(400).json({ error: 'Subject is assigned to one or more teachers' });
    }

    await subject.destroy();

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const viewSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll();

    res.status(200).json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addSubject, deleteSubject, deleteSubjectFromTeacher, addSubjectToTeacher,viewSubjects };
