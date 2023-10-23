const csv = require("csv-parser");
const Teacher = require("../models/teacher");
const Subject = require("../models/subject");
const TeacherSubject = require("../models/teacher-subject");
const { Readable } = require("stream");
const { sequelize,Sequelize } = require("../models/db");

const createTeacher = async (req, res) => {
  try {
    const teacherData = req.body;
    await Teacher.create(teacherData);
    res.status(201).json({ message: "Teacher created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const viewTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    const teacher = await Teacher.findOne({
      where: {
        id: teacherId,
        isActive: true,
      },
      include: [Subject],
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const viewTeacherAll = async (req, res) => {
  try {
    const { filterBy } = req.body;
    let whereClause = { isActive: true };
    const include = [Subject];

    if (filterBy) {
      whereClause = {
        isActive: true,
        [Sequelize.Op.or]: [
          { firstName: { [Sequelize.Op.iLike]: `%${filterBy}%` } },
          { lastName: { [Sequelize.Op.iLike]: `%${filterBy}%` } },
          { '$Subjects.name$': { [Sequelize.Op.iLike]: `%${filterBy}%` } },
        ],
      };
    }

    const teachers = await Teacher.findAll({
      where: whereClause,
      include,
    });

    res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const editTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const teacherData = req.body;

    const teacher = await Teacher.findOne({
      where: {
        id: teacherId,
        isActive: true,
      },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    await teacher.update(teacherData);
    res
      .status(200)
      .json({ message: "Teacher updated successfully", teacherId: teacherId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    const teacher = await Teacher.findByPk(teacherId);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    teacher.isActive = false;
    await teacher.save();

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const teacherId = req.body.teacherId;
    const profilePicture = req.file ? req.file.filename : null;
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    teacher.profilePicture = profilePicture;
    await teacher.save();
    res.status(200).json({ message: "Profile picture uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const importCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const records = [];

    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    await TeacherSubject.destroy({ where: {}, truncate: true });
    await sequelize.query('TRUNCATE "Teachers" CASCADE;');
    await sequelize.query('TRUNCATE "Subjects" CASCADE;');

    bufferStream
      .pipe(csv())
      .on("data", (record) => {
        records.push(record);
      })
      .on("end", async () => {
        try {
          await processCSVData(records);
          res.status(200).json({ message: "CSV import successful" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Import error" });
  }
};

async function processCSVData(data) {
  for (const record of data) {
    const teacherData = {
      firstName: (record["First Name"] || "").trim() || null,
      lastName: (record["Last Name"] || "").trim() || null,
      profilePicture: (record["Profile picture"] || "").trim() || null,
      emailAddress: (record["Email Address"] || "").trim() || null,
      phone: (record["Phone Number"] || "").trim() || null,
      roomNumber: (record["Room Number"] || "").trim() || null,
    };

    if (
      teacherData.firstName &&
      teacherData.lastName &&
      teacherData.emailAddress
    ) {
      const teacher = await Teacher.create(teacherData);

      const subjects = record["Subjects taught"]
        .split(",")
        .map((subject) => subject.trim())
        .map((subject) => toTitleCase(subject))
        .slice(0, 5);

      for (const subjectName of subjects) {
        if (subjectName && subjectName.length > 0) {
          let [subject] = await Subject.findOrCreate({
            where: { name: subjectName },
          });
          await teacher.addSubject(subject);
        }
      }
    }
  }
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

module.exports = {
  importCsv,
  createTeacher,
  viewTeacher,
  viewTeacherAll,
  deleteTeacher,
  editTeacher,
  uploadProfilePicture,
};
