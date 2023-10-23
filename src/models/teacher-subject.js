const { DataTypes } = require('sequelize');
const sequelize = require('./db').sequelize;

const TeacherSubject = sequelize.define('TeacherSubjects', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  TeacherId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Teachers',
      key: 'id',
    },
  },
  SubjectId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Subjects',
      key: 'id',
    },
  },
});

module.exports = TeacherSubject;
