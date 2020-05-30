const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const Term = sequelize.define('term', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  startTime: {
    type: Sequelize.STRING(10),
    allowNull: false
  }
},
{
  underscored: true, // Convert camelCase to camel_case
  freezeTableName: true, // Let table name be in singular
});

module.exports = Term;