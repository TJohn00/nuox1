'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Teachers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profilePicture: {
        type: Sequelize.STRING,
      },
      emailAddress: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
      },
      roomNumber: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('TeacherSubjects', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      TeacherId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Teachers',
          key: 'id',
        },
      },
      SubjectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Subjects',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TeacherSubjects');
    await queryInterface.dropTable('Teachers');
  },
};
