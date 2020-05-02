const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const InstructorCourse = sequelize.define('instructor_course', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
},
{
  underscored: true, // Convert camelCase to camel_case
  freezeTableName: true, // Let table name be in singular
});

module.exports = InstructorCourse;