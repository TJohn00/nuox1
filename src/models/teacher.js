const { DataTypes } = require("sequelize");
const sequelize = require("./db").sequelize;
const Subject = require("./subject")
const Teacher = sequelize.define("Teacher", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.STRING,
  },
  emailAddress: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  roomNumber: {
    type: DataTypes.STRING,
  },
  isActive:{
    type:DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

Teacher.belongsToMany(Subject, { through: "TeacherSubjects" });

module.exports = Teacher;
