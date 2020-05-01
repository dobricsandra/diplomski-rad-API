const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const Course = sequelize.define('course', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  abbreviation: {
      type: Sequelize.STRING(10),
      allowNull: false
  }
}, 
{
  underscored: true, // Convert camelCase to camel_case
  freezeTableName: true, // Let table name be in singular
});

module.exports = Course;