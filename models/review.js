const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const Review = sequelize.define('review', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  reviewMark: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},
{
  underscored: true, // Convert camelCase to camel_case
  freezeTableName: true, // Let table name be in singular
});

module.exports = Review;