const { DataTypes } = require('sequelize');
const sequelize = require('./db').sequelize;

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Subject;
